import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { Navbar } from './index';
import { serviceProvider } from '../../core/services';

// Register the custom element if not already registered
if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', Navbar);
}

describe('Navbar', () => {
  let navbar: Navbar;

  beforeAll(() => {
    // Initialize services only once
    if (!serviceProvider.isInitialized()) {
      serviceProvider.initialize();
    }
  });

  beforeEach(() => {
    // Reset store state before each test
    const store = serviceProvider.getStore();
    store.reset();
    // Create navbar component
    navbar = document.createElement('app-navbar') as Navbar;
    document.body.appendChild(navbar);
  });

  afterEach(() => {
    if (navbar && document.body.contains(navbar)) {
      document.body.removeChild(navbar);
    }
  });

  describe('Language switcher', () => {
    it('should switch language on first click', async () => {
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const languageMenu = navbar.querySelector('#language-menu');
      const polishLink = languageMenu?.querySelector('[data-lang="pl"]') as HTMLElement;
      
      expect(polishLink).toBeTruthy();
      
      // Click Polish language option
      polishLink.click();
      
      // Wait for language change
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check if language changed in store
      const store = serviceProvider.getStore();
      expect(store.get().language).toBe('pl');
    });

    it('should switch language multiple times', async () => {
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const languageMenu = navbar.querySelector('#language-menu');
      const polishLink = languageMenu?.querySelector('[data-lang="pl"]') as HTMLElement;
      const englishLink = languageMenu?.querySelector('[data-lang="en"]') as HTMLElement;
      
      expect(polishLink).toBeTruthy();
      expect(englishLink).toBeTruthy();
      
      const store = serviceProvider.getStore();
      
      // First switch: English -> Polish
      polishLink.click();
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(store.get().language).toBe('pl');
      
      // Second switch: Polish -> English
      englishLink.click();
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(store.get().language).toBe('en');
      
      // Third switch: English -> Polish
      polishLink.click();
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(store.get().language).toBe('pl');
    });

    it('should update current language display after switching', async () => {
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const languageMenu = navbar.querySelector('#language-menu');
      const polishLink = languageMenu?.querySelector('[data-lang="pl"]') as HTMLElement;
      
      // Get initial language display
      const initialLanguageSpan = navbar.querySelector('#current-language');
      const initialText = initialLanguageSpan?.textContent;
      
      // Switch to Polish
      polishLink.click();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Check if language display updated
      const updatedLanguageSpan = navbar.querySelector('#current-language');
      const updatedText = updatedLanguageSpan?.textContent;
      
      expect(updatedText).not.toBe(initialText);
      expect(updatedText).toContain('Polski');
    });
  });
}); 