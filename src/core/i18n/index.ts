type NestedStringRecord = { [key: string]: string | NestedStringRecord };

interface Translations {
  commands: Record<string, { description: string }>;
  categories: Record<string, string>;
  ui: NestedStringRecord;
}

const translationsCache: Record<string, Translations> = {};

// Use Vite's glob import for robust translation file loading
const translationModules = import.meta.glob<Translations>('./*.json', { eager: false, import: 'default' });

async function loadTranslations(locale: string = 'en'): Promise<Translations> {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }

  const path = `./${locale}.json`;
  const loader = translationModules[path];
  
  if (loader) {
    try {
      const translations = await loader();
      translationsCache[locale] = translations;
      return translations;
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
    }
  } else {
    console.warn(`No translation module found for locale: ${locale}`);
  }

  // Fallback translations
  const fallback: Translations = {
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

/**
 * Retrieves a nested value from an object using a dot-separated path.
 */
function getNestedValue(obj: NestedStringRecord, path: string): string | undefined {
  const value = path.split('.').reduce<string | NestedStringRecord | undefined>((acc, part) => {
    if (typeof acc === 'object' && acc !== null && !Array.isArray(acc)) {
      return (acc as NestedStringRecord)[part];
    }
    return undefined;
  }, obj);

  if (typeof value === 'string') {
    return value;
  }
  return undefined;
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

  async getUIString(key: string, parameters?: Record<string, string>): Promise<string> {
    const translations = await loadTranslations(this.currentLocale);
    const translation = getNestedValue(translations.ui, key);
    
    if (typeof translation !== 'string') {
      return key; // Return the key if no translation is found
    }

    let result = translation;
    if (parameters) {
      // Replace placeholders like {param} with actual values
      for (const [param, value] of Object.entries(parameters)) {
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
      }
    }
    
    return result;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }
}