import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BaseComponent } from './base-component';
import { serviceProvider } from '../services';
import { EventBus } from '../events';
import { Store } from '../store';
import { I18n } from '../i18n';

// Create a concrete implementation for testing
class TestComponent extends BaseComponent {
  public renderCalled = false;
  public setupEventListenersCalled = false;
  public cleanupCalled = false;

  // Expose protected properties for testing
  public get testEventBus() { return this.eventBus; }
  public get testStore() { return this.store; }
  public get testI18n() { return this.i18n; }
  public get testServices() { return this.getServices(); }

  protected async render(): Promise<void> {
    this.renderCalled = true;
    this.innerHTML = '<div>Test</div>';
  }

  protected setupEventListeners(): void {
    this.setupEventListenersCalled = true;
  }

  protected cleanup(): void {
    this.cleanupCalled = true;
    super.cleanup();
  }

  // Expose protected methods for testing
  public testSetupLanguageListener() {
    return this.setupLanguageListener();
  }

  public testRender() {
    return this.render();
  }
}

describe('BaseComponent', () => {
  let component: TestComponent;

  beforeEach(() => {
    // Initialize the service provider
    if (!serviceProvider.isInitialized()) {
      serviceProvider.initialize();
    }
    
    // Define the custom element
    if (!customElements.get('test-component')) {
      customElements.define('test-component', TestComponent);
    }
    
    component = document.createElement('test-component') as TestComponent;
  });

  afterEach(() => {
    if (component.parentNode) {
      component.parentNode.removeChild(component);
    }
  });

  describe('Service injection', () => {
    it('should inject services from provider', () => {
      expect(component.testEventBus).toBeInstanceOf(EventBus);
      expect(component.testStore).toBeInstanceOf(Store);
      expect(component.testI18n).toBeInstanceOf(I18n);
    });

    it('should provide access to all services via getServices', () => {
      const services = component.testServices;
      expect(services.eventBus).toBeInstanceOf(EventBus);
      expect(services.store).toBeInstanceOf(Store);
      expect(services.i18n).toBeInstanceOf(I18n);
    });
  });

  describe('Lifecycle methods', () => {
    it('should call render, setupEventListeners, and setupLanguageListener on connectedCallback', async () => {
      // Spy on the actual protected method using Object.getPrototypeOf
      const languageListenerSpy = vi.spyOn(Object.getPrototypeOf(component), 'setupLanguageListener');
      
      document.body.appendChild(component);
      
      // Wait for async connectedCallback
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(component.renderCalled).toBe(true);
      expect(component.setupEventListenersCalled).toBe(true);
      expect(languageListenerSpy).toHaveBeenCalled();
    });

    it('should call cleanup on disconnectedCallback', () => {
      document.body.appendChild(component);
      document.body.removeChild(component);
      
      expect(component.cleanupCalled).toBe(true);
    });
  });

  describe('Language change handling', () => {
    it('should re-render when language changes', async () => {
      document.body.appendChild(component);
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Reset the flag
      component.renderCalled = false;
      
      // Emit language change
      const eventBus = serviceProvider.getEventBus();
      eventBus.emit('language:changed', 'pl');
      
      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(component.renderCalled).toBe(true);
    });
  });

  describe('Abstract methods', () => {
    it('should require render method to be implemented', () => {
      // This would cause a TypeScript error if render is not implemented
      expect(typeof component.testRender).toBe('function');
    });
  });
}); 