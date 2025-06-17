interface Translations {
  commands: Record<string, { description: string }>;
  categories: Record<string, string>;
  ui: Record<string, string>;
}

const translationsCache: Record<string, Translations> = {};

async function loadTranslations(locale: string = 'en'): Promise<Translations> {
  if (translationsCache[locale]) return translationsCache[locale];
  
  try {
    const response = await fetch(`/src/core/i18n/${locale}.json`);
    const translations = await response.json();
    translationsCache[locale] = translations;
    return translations;
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback translations
    const fallback = {
      commands: {},
      categories: {
        movement: 'Movement',
        drawing: 'Drawing',
        visual: 'Visual',
        appearance: 'Appearance',
        programmatic: 'Programming',
        custom: 'Custom'
      },
      ui: {}
    };
    translationsCache[locale] = fallback;
    return fallback;
  }
}

import type { EventBus, EventMap } from '../events';
import type { Store } from '../store';

export class I18n {
  private currentLocale: string = 'en';
  private unsubscribeLanguageChange?: () => void;

  constructor(private eventBus: EventBus<EventMap>, private store: Store) {
    // Listen for language change requests
    this.unsubscribeLanguageChange = eventBus.on('language:change', async (newLanguage: string) => {
      await this.changeLanguage(newLanguage);
    });

    // Initialize with current language from store
    const currentLanguage = store.get().language;
    this.setLocale(currentLanguage);
  }

  private async changeLanguage(newLanguage: string) {
    try {
      // Update store
      this.store.set({ language: newLanguage });
      
      // Update i18n
      await this.setLocale(newLanguage);
      
      // Notify all components that language has changed
      this.eventBus.emit('language:changed', newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }

  async setLocale(locale: string) {
    this.currentLocale = locale;
    await loadTranslations(locale);
  }

  destroy() {
    this.unsubscribeLanguageChange?.();
  }

  async getCommandDescription(commandKey: string): Promise<string> {
    const translations = await loadTranslations(this.currentLocale);
    return translations.commands[commandKey]?.description || `Description for ${commandKey}`;
  }

  async getCategoryName(categoryKey: string): Promise<string> {
    const translations = await loadTranslations(this.currentLocale);
    return translations.categories[categoryKey] || categoryKey;
  }

  async getAllTranslations(): Promise<Translations> {
    return await loadTranslations(this.currentLocale);
  }

  async getUIString(key: string): Promise<string> {
    const translations = await loadTranslations(this.currentLocale);
    return translations.ui[key] || key;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }
}

// i18n instance will be created in main.ts with dependencies 