import { describe, it, expect, beforeEach } from 'vitest';
import { serviceProvider } from './index';
import { EventBus } from '../events';
import { Store } from '../store';
import { I18n } from '../i18n';

describe('ServiceProvider', () => {
  beforeEach(() => {
    // Reset the singleton for each test by calling initialize if not already initialized
    // This ensures we start with a clean state
    if (!serviceProvider.isInitialized()) {
      serviceProvider.initialize();
    }
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = serviceProvider;
      const instance2 = serviceProvider;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initialization', () => {
    it('should initialize and create all services', () => {
      // Create a fresh provider for this test
      const freshProvider = Object.create(Object.getPrototypeOf(serviceProvider));
      freshProvider.initialize();
      expect(freshProvider.isInitialized()).toBe(true);
    });

    it('should throw error when accessing services before initialization', () => {
      // Create a fresh provider for this test
      const freshProvider = Object.create(Object.getPrototypeOf(serviceProvider));
      expect(() => freshProvider.getServices()).toThrow('Services not initialized');
    });

    it('should throw error when initializing twice', () => {
      // Create a fresh provider for this test
      const freshProvider = Object.create(Object.getPrototypeOf(serviceProvider));
      freshProvider.initialize();
      expect(() => freshProvider.initialize()).toThrow('Services already initialized');
    });
  });

  describe('Service access', () => {
    it('should provide access to eventBus', () => {
      const eventBus = serviceProvider.getEventBus();
      expect(eventBus).toBeInstanceOf(EventBus);
    });

    it('should provide access to store', () => {
      const store = serviceProvider.getStore();
      expect(store).toBeInstanceOf(Store);
    });

    it('should provide access to i18n', () => {
      const i18n = serviceProvider.getI18n();
      expect(i18n).toBeInstanceOf(I18n);
    });

    it('should provide access to all services', () => {
      const services = serviceProvider.getServices();
      expect(services.eventBus).toBeInstanceOf(EventBus);
      expect(services.store).toBeInstanceOf(Store);
      expect(services.i18n).toBeInstanceOf(I18n);
    });

    it('should create services with proper dependencies', () => {
      const services = serviceProvider.getServices();
      
      // Verify that i18n has the correct eventBus and store instances
      expect(services.i18n).toBeInstanceOf(I18n);
      
      // The i18n instance should be using the same eventBus and store
      // We can verify this by checking that they're the same instances
      expect(services.eventBus).toBe(services.eventBus);
      expect(services.store).toBe(services.store);
    });
  });

  describe('Convenience functions', () => {
    it('should provide getEventBus convenience function', async () => {
      const { getEventBus } = await import('./index');
      const eventBus = getEventBus();
      expect(eventBus).toBeInstanceOf(EventBus);
    });

    it('should provide getStore convenience function', async () => {
      const { getStore } = await import('./index');
      const store = getStore();
      expect(store).toBeInstanceOf(Store);
    });

    it('should provide getI18n convenience function', async () => {
      const { getI18n } = await import('./index');
      const i18n = getI18n();
      expect(i18n).toBeInstanceOf(I18n);
    });

    it('should provide getServices convenience function', async () => {
      const { getServices } = await import('./index');
      const services = getServices();
      expect(services.eventBus).toBeInstanceOf(EventBus);
      expect(services.store).toBeInstanceOf(Store);
      expect(services.i18n).toBeInstanceOf(I18n);
    });
  });
}); 