interface Translations {
  commands: Record<string, { description: string }>;
  categories: Record<string, string>;
}

let translations: Translations | null = null;

async function loadTranslations(locale: string = 'en'): Promise<Translations> {
  if (translations) return translations;
  
  try {
    const response = await fetch(`/src/i18n/${locale}.json`);
    translations = await response.json();
    return translations!;
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback translations
    return {
      commands: {},
      categories: {
        movement: 'Movement',
        drawing: 'Drawing',
        visual: 'Visual',
        appearance: 'Appearance',
        programmatic: 'Programming',
        custom: 'Custom'
      }
    };
  }
}

export class I18n {
  private translations: Translations = { commands: {}, categories: {} };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.translations = await loadTranslations();
  }

  async getCommandDescription(commandKey: string): Promise<string> {
    if (Object.keys(this.translations.commands).length === 0) {
      await this.initialize();
    }
    
    return this.translations.commands[commandKey]?.description || `Description for ${commandKey}`;
  }

  async getCategoryName(categoryKey: string): Promise<string> {
    if (Object.keys(this.translations.categories).length === 0) {
      await this.initialize();
    }
    
    return this.translations.categories[categoryKey] || categoryKey;
  }

  async getAllTranslations(): Promise<Translations> {
    if (Object.keys(this.translations.commands).length === 0) {
      await this.initialize();
    }
    
    return this.translations;
  }
}

export const i18n = new I18n(); 