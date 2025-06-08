import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommandInput } from '.';
import { eventBus } from '../../core/events';

describe('CommandInput', () => {
  let element: CommandInput;

  beforeEach(() => {
    // Define the custom element before creating it
    if (!customElements.get('command-input')) {
      customElements.define('command-input', CommandInput);
    }
    
    element = document.createElement('command-input') as CommandInput;
    document.body.appendChild(element);
  });

  it('should emit command:execute event when form is submitted', async () => {
    const emitSpy = vi.spyOn(eventBus, 'emit');
    const form = element.querySelector('form') as HTMLFormElement;
    const input = element.querySelector('input') as HTMLInputElement;
    
    input.value = 'forward(100)';
    form.dispatchEvent(new Event('submit'));

    expect(emitSpy).toHaveBeenCalledWith('command:execute', 'forward(100)');
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('should not emit empty commands', () => {
    const emitSpy = vi.spyOn(eventBus, 'emit');
    const form = element.querySelector('form') as HTMLFormElement;
    const input = element.querySelector('input') as HTMLInputElement;
    
    input.value = '   ';
    form.dispatchEvent(new Event('submit'));

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
