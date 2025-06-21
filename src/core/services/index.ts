import { EventBus, type EventMap } from '../events';
import { Store } from '../store';
import { I18n } from '../i18n';
import { CommandValidator } from '../command-validator';

export interface AppServices {
  eventBus: EventBus<EventMap>;
  store: Store;
  i18n: I18n;
  commandValidator: CommandValidator;
}

class ServiceProvider {
  private static instance: ServiceProvider;
  private services: AppServices | null = null;

  private constructor() {}

  static getInstance(): ServiceProvider {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }

  initialize(): void {
    if (this.services) {
      throw new Error('Services already initialized');
    }

    // Create all services internally
    const eventBus = new EventBus<EventMap>();
    const store = new Store({ commandResult: null, language: 'en' });
    const i18n = new I18n(eventBus, store);
    const commandValidator = new CommandValidator(i18n);

    this.services = {
      eventBus,
      store,
      i18n,
      commandValidator
    };
  }

  getServices(): AppServices {
    if (!this.services) {
      throw new Error('Services not initialized. Call ServiceProvider.initialize() first.');
    }
    return this.services;
  }

  getEventBus(): EventBus<EventMap> {
    return this.getServices().eventBus;
  }

  getStore(): Store {
    return this.getServices().store;
  }

  getI18n(): I18n {
    return this.getServices().i18n;
  }

  getCommandValidator(): CommandValidator {
    return this.getServices().commandValidator;
  }

  isInitialized(): boolean {
    return this.services !== null;
  }
}

// Export singleton instance
export const serviceProvider = ServiceProvider.getInstance();

// Convenience functions for easy access
export const getEventBus = () => serviceProvider.getEventBus();
export const getStore = () => serviceProvider.getStore();
export const getI18n = () => serviceProvider.getI18n();
export const getCommandValidator = () => serviceProvider.getCommandValidator();
export const getServices = () => serviceProvider.getServices(); 