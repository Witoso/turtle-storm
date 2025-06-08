import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { eventBus } from '../core/events';
import { CommandInput } from '../components/command-input';
import { CommandHistory } from '../components/command-history';
import { TurtleCanvas } from '../components/turtle-canvas';

describe('Integration: Command Flow', () => {
  let container: HTMLDivElement;
  let drawSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Define custom elements
    if (!customElements.get('command-input')) {
      customElements.define('command-input', CommandInput);
    }
    if (!customElements.get('command-history')) {
      customElements.define('command-history', CommandHistory);
    }
    if (!customElements.get('turtle-canvas')) {
      customElements.define('turtle-canvas', TurtleCanvas);
    }

    // Create a container for our components
    container = document.createElement('div');
    container.innerHTML = `
      <div class="turtle-storm">
        <turtle-canvas>
          <canvas id="turtle-canvas"></canvas>
        </turtle-canvas>
        <command-history></command-history>
      </div>
      <command-input></command-input>
    `;
    document.body.appendChild(container);

    // Setup spy
    drawSpy = vi.spyOn(eventBus, 'emit');
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('should flow commands through the system', async () => {
    // Get references to our components
    const commandInput = container.querySelector('command-input');
    const commandHistory = container.querySelector('command-history');
    expect(commandInput).toBeTruthy();
    expect(commandHistory).toBeTruthy();
    
    // Wait for components to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate command input
    const form = commandInput?.querySelector('form');
    const input = commandInput?.querySelector('input') as HTMLInputElement | null;
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
    
    if (input && form) {
      input.value = 'forward(100)';
      form.dispatchEvent(new Event('submit'));
      
      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify command appears in history
      const historyItems = commandHistory?.querySelectorAll('.command-item');
      expect(historyItems?.length).toBe(1);
      expect(historyItems?.[0].textContent).toBe('forward(100)');

      // Verify turtle received draw command
      expect(drawSpy).toHaveBeenCalledWith('turtle:draw', ['forward(100)']);
    }
  });

  it('should clear all components on reset', async () => {
    const commandInput = container.querySelector('command-input');
    const commandHistory = container.querySelector('command-history');
    expect(commandInput).toBeTruthy();
    expect(commandHistory).toBeTruthy();
    
    // Wait for components to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Add some commands first
    const form = commandInput?.querySelector('form');
    const input = commandInput?.querySelector('input') as HTMLInputElement | null;
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
    
    if (input && form) {
      input.value = 'forward(100)';
      form.dispatchEvent(new Event('submit'));
      
      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Find and click reset button
      const resetButton = commandHistory?.querySelector('button.outline') as HTMLButtonElement | null;
      expect(resetButton).toBeTruthy();
      
      if (resetButton) {
        resetButton.click();
        
        // Wait for reset to process
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify history is cleared
        const historyItems = commandHistory?.querySelectorAll('.command-item');
        expect(historyItems?.length).toBe(0);

        // Verify turtle canvas is reset
        expect(drawSpy).toHaveBeenCalledWith('turtle:draw', []);
      }
    }
  });
});
