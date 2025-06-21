import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommandInput } from '.';
import { serviceProvider } from '../../core/services';

describe('CommandInput', () => {
  let element: CommandInput;

  beforeEach(async () => {
    // Initialize the service provider
    if (!serviceProvider.isInitialized()) {
      serviceProvider.initialize();
    }
    
    // Define the custom element before creating it
    if (!customElements.get('command-input')) {
      customElements.define('command-input', CommandInput);
    }
    
    element = document.createElement('command-input') as CommandInput;
    document.body.appendChild(element);
    
    // Wait for the component to render
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  it('should emit command:execute event when form is submitted', async () => {
    const eventBus = serviceProvider.getEventBus();
    const emitSpy = vi.spyOn(eventBus, 'emit');
    const form = element.querySelector('form') as HTMLFormElement;
    const input = element.querySelector('input') as HTMLInputElement;
    
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
    
    input.value = 'forward(100)';
    form.dispatchEvent(new Event('submit'));

    // Wait for async validation to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(emitSpy).toHaveBeenCalledWith('command:execute', 'forward(100)');
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('should not emit empty commands', async () => {
    const eventBus = serviceProvider.getEventBus();
    const emitSpy = vi.spyOn(eventBus, 'emit');
    const form = element.querySelector('form') as HTMLFormElement;
    const input = element.querySelector('input') as HTMLInputElement;
    
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
    
    input.value = '   ';
    form.dispatchEvent(new Event('submit'));

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
