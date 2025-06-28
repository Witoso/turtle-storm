import { getEventBus, getI18n, getStore, getCommandValidator, type AppServices } from '../services';
import type { EventBus, EventMap } from '../events';
import type { Store } from '../store';
import type { I18n } from '../i18n';

export abstract class BaseComponent extends HTMLElement {
  protected eventBus: EventBus<EventMap>;
  protected store: Store;
  protected i18n: I18n;
  protected unsubscribeLanguageChanged?: () => void;

  constructor() {
    super();
    
    // Get services from the provider
    this.eventBus = getEventBus();
    this.store = getStore();
    this.i18n = getI18n();
  }

  async connectedCallback() {
    await this.render();
    this.setupEventListeners();
    this.setupLanguageListener();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  /**
   * Render the component content. Must be implemented by subclasses.
   */
  protected abstract render(): Promise<void>;

  /**
   * Set up component-specific event listeners. Can be overridden by subclasses.
   */
  protected setupEventListeners(): void {
    // Default implementation - subclasses can override
  }

  /**
   * Set up language change listener. Can be overridden by subclasses.
   */
  protected setupLanguageListener(): void {
    this.unsubscribeLanguageChanged = this.eventBus.on('language:changed', async () => {
      await this.render();
      // Re-attach event listeners after re-rendering since DOM elements are replaced
      this.setupEventListeners();
    });
  }

  /**
   * Clean up resources. Can be overridden by subclasses.
   */
  protected cleanup(): void {
    this.unsubscribeLanguageChanged?.();
  }

  /**
   * Get all services at once. Useful for components that need multiple services.
   */
  protected getServices(): AppServices {
    return {
      eventBus: this.eventBus,
      store: this.store,
      i18n: this.i18n,
      commandValidator: getCommandValidator()
    };
  }
} 