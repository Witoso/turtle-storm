import { eventBus } from '../../core/events';
import { store } from '../../core/store';

export class Navbar extends HTMLElement {
  private unsubscribeLanguageChanged?: () => void;

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    
    // Update language select immediately to reflect current state from localStorage
    this.updateLanguageSelect();
    
    // Subscribe to store changes for future updates

    // Listen for language change confirmations
    this.unsubscribeLanguageChanged = eventBus.on('language:changed', () => {
      this.updateLanguageSelect();
    });
  }

  disconnectedCallback() {
    this.unsubscribeLanguageChanged?.();
  }

  private render() {
    this.innerHTML = `
      <nav class="container-fluid">
        <ul>
          <li><strong>Turtle Storm ⚡️🐢⚡️</strong></li>
        </ul>
        <ul>
          <li>
            <details class="dropdown">
              <summary role="button" class="secondary">
                🌐 <span id="current-language">English</span>
              </summary>
              <ul id="language-menu">
                <li><a href="#" data-lang="en">🇺🇸 English</a></li>
                <li><a href="#" data-lang="pl">🇵🇱 Polski</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    `;
  }

  private attachEventListeners() {
    const languageMenu = this.querySelector('#language-menu');
    if (languageMenu) {
      languageMenu.addEventListener('click', this.handleLanguageChange.bind(this));
    }
  }

  private handleLanguageChange(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'A' && target.dataset.lang) {
      const newLanguage = target.dataset.lang;
      
      // Close dropdown
      const details = this.querySelector('details');
      if (details) {
        details.removeAttribute('open');
      }

      // Emit language change event through the event bus
      eventBus.emit('language:change', newLanguage);
    }
  }

  private updateLanguageSelect() {
    const currentLanguage = store.get().language;
    const currentLanguageSpan = this.querySelector('#current-language');
    
    if (currentLanguageSpan) {
      const languageNames: Record<string, string> = {
        'en': 'English',
        'pl': 'Polski'
      };
      currentLanguageSpan.textContent = languageNames[currentLanguage] || 'English';
    }
  }
} 