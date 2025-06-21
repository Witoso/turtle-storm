import { BaseComponent } from '../../core/components/base-component';

export class Navbar extends BaseComponent {
  protected async render(): Promise<void> {
    const currentLanguage = this.store.get().language;
    const languageNames: Record<string, string> = {
      'en': await this.i18n.getUIString('languageEnglish'),
      'pl': await this.i18n.getUIString('languagePolish')
    };
    
    this.innerHTML = `
      <nav class="container-fluid">
        <ul>
          <li><strong>${await this.i18n.getUIString('appTitle')}</strong></li>
        </ul>
        <ul>
          <li>
            <details class="dropdown">
              <summary role="button" class="secondary">
                🌐 <span id="current-language">${languageNames[currentLanguage]}</span>
              </summary>
              <ul id="language-menu">
                <li><a href="#" data-lang="en">🇺🇸 ${languageNames['en']}</a></li>
                <li><a href="#" data-lang="pl">🇵🇱 ${languageNames['pl']}</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    `;
  }

  protected setupEventListeners(): void {
    this.attachEventListeners();
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
      this.eventBus.emit('language:change', newLanguage);
    }
  }

  protected async setupLanguageListener(): Promise<void> {
    // Override to also update the language select when language changes
    this.unsubscribeLanguageChanged = this.eventBus.on('language:changed', async () => {
      await this.render();
      await this.updateLanguageSelect();
    });
  }

  private async updateLanguageSelect() {
    const currentLanguage = this.store.get().language;
    const currentLanguageSpan = this.querySelector('#current-language');
    if (currentLanguageSpan) {
      const languageNames: Record<string, string> = {
        'en': await this.i18n.getUIString('languageEnglish'),
        'pl': await this.i18n.getUIString('languagePolish')
      };
      currentLanguageSpan.textContent = languageNames[currentLanguage] || languageNames['en'];
    }
  }
} 