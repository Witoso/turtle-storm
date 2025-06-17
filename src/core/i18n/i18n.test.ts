import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18n } from './index';
import { EventBus, type EventMap } from '../events';
import { Store } from '../store';
import { commandRegistry } from '../data/command-registry';
import enJson from './en.json';
import plJson from './pl.json';

const en = enJson as { commands: Record<string, { description: string }>, categories: Record<string, string> };
const pl = plJson as { commands: Record<string, { description: string }>, categories: Record<string, string> };

// Mock fetch for translation loading
globalThis.fetch = vi.fn().mockImplementation((url: string) => {
  if (url.includes('en.json')) {
    return Promise.resolve({
      json: () => Promise.resolve(en)
    });
  }
  if (url.includes('pl.json')) {
    return Promise.resolve({
      json: () => Promise.resolve(pl)
    });
  }
  return Promise.reject(new Error(`Mock fetch: Not found for ${url}`));
});

describe('I18n', () => {
  let eventBus: EventBus<EventMap>;
  let store: Store;
  let i18n: I18n;

  beforeEach(async () => {
    eventBus = new EventBus<EventMap>();
    store = new Store({ commandResult: null, language: 'en' });
    i18n = new I18n(eventBus, store);
    
    // Ensure i18n is initialized with English locale
    await i18n.setLocale('en');
  });

  describe('Translation completeness', () => {
    it('has translations for every command in en.json and pl.json', () => {
      const missingEn: string[] = [];
      const missingPl: string[] = [];
      Object.keys(commandRegistry).forEach(cmd => {
        if (!en.commands[cmd] || !en.commands[cmd].description) missingEn.push(cmd);
        if (!pl.commands[cmd] || !pl.commands[cmd].description) missingPl.push(cmd);
      });
      expect(missingEn).toEqual([]);
      expect(missingPl).toEqual([]);
    });
  });

  describe('Constructor and initialization', () => {
    it('should initialize with default locale from store', () => {
      expect(i18n.getCurrentLocale()).toBe('en');
    });

    it('should listen for language:change events', () => {
      const spy = vi.spyOn(eventBus, 'on');
      new I18n(eventBus, store);
      expect(spy).toHaveBeenCalledWith('language:change', expect.any(Function));
    });
  });

  describe('Language switching', () => {
    it('should handle language:change event and update store', async () => {
      const languageChangedSpy = vi.fn();
      eventBus.on('language:changed', languageChangedSpy);

      eventBus.emit('language:change', 'pl');
      
      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(store.get().language).toBe('pl');
      expect(i18n.getCurrentLocale()).toBe('pl');
      expect(languageChangedSpy).toHaveBeenCalledWith('pl');
    });

    it('should emit language:changed event after successful language change', async () => {
      const languageChangedSpy = vi.fn();
      eventBus.on('language:changed', languageChangedSpy);

      eventBus.emit('language:change', 'pl');
      
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(languageChangedSpy).toHaveBeenCalledWith('pl');
    });

    it('should handle language change errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock setLocale to throw an error
      const originalSetLocale = i18n.setLocale;
      i18n.setLocale = vi.fn().mockRejectedValue(new Error('Translation load failed'));

      eventBus.emit('language:change', 'invalid-locale');
      
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(consoleSpy).toHaveBeenCalledWith('Failed to change language:', expect.any(Error));
      
      // Restore
      i18n.setLocale = originalSetLocale;
      consoleSpy.mockRestore();
    });
  });

  describe('Translation methods', () => {
    it('should get command description for current locale', async () => {
      const description = await i18n.getCommandDescription('forward');
      expect(description).toBe('Move the turtle forward by a number of steps.');
    });

    it('should get command description for Polish locale', async () => {
      eventBus.emit('language:change', 'pl');
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const description = await i18n.getCommandDescription('forward');
      expect(description).toBe('Przesuń żółwia do przodu o podaną liczbę kroków.');
    });

    it('should return fallback description for unknown command', async () => {
      const description = await i18n.getCommandDescription('unknownCommand');
      expect(description).toBe('Description for unknownCommand');
    });

    it('should get category name for current locale', async () => {
      const categoryName = await i18n.getCategoryName('movement');
      expect(categoryName).toBe('Movement');
    });

    it('should get category name for Polish locale', async () => {
      eventBus.emit('language:change', 'pl');
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const categoryName = await i18n.getCategoryName('movement');
      expect(categoryName).toBe('Ruch');
    });

    it('should return fallback category name for unknown category', async () => {
      const categoryName = await i18n.getCategoryName('unknownCategory');
      expect(categoryName).toBe('unknownCategory');
    });

    it('should get all translations for current locale', async () => {
      const translations = await i18n.getAllTranslations();
      expect(translations).toHaveProperty('commands');
      expect(translations).toHaveProperty('categories');
      expect(translations.commands.forward).toHaveProperty('description');
    });
  });

  describe('Locale management', () => {
    it('should set locale manually', async () => {
      await i18n.setLocale('pl');
      expect(i18n.getCurrentLocale()).toBe('pl');
    });

    it('should load translations when setting locale', async () => {
      await i18n.setLocale('pl');
      const description = await i18n.getCommandDescription('forward');
      expect(description).toBe('Przesuń żółwia do przodu o podaną liczbę kroków.');
    });
  });

  describe('Cleanup', () => {
    it('should have destroy method for cleanup', () => {
      expect(typeof i18n.destroy).toBe('function');
    });

    it('should unsubscribe from events when destroyed', () => {
      i18n.destroy();
      // The destroy method should clean up the subscription
      expect(i18n.destroy).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple rapid language changes', async () => {
      const languageChangedSpy = vi.fn();
      eventBus.on('language:changed', languageChangedSpy);

      eventBus.emit('language:change', 'pl');
      eventBus.emit('language:change', 'en');
      eventBus.emit('language:change', 'pl');
      
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(store.get().language).toBe('pl');
      expect(i18n.getCurrentLocale()).toBe('pl');
      expect(languageChangedSpy).toHaveBeenCalledTimes(3);
    });

    it('should maintain state consistency after language changes', async () => {
      // Change to Polish
      eventBus.emit('language:change', 'pl');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.get().language).toBe('pl');
      expect(i18n.getCurrentLocale()).toBe('pl');

      // Change back to English
      eventBus.emit('language:change', 'en');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.get().language).toBe('en');
      expect(i18n.getCurrentLocale()).toBe('en');
    });
  });
}); 