import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommandHistory } from '.';
import { eventBus } from '../../core/events';

describe('CommandHistory', () => {
  let element: CommandHistory;

  beforeEach(() => {
    // Define the custom element before creating it
    if (!customElements.get('command-history')) {
      customElements.define('command-history', CommandHistory);
    }
    
    element = document.createElement('command-history') as CommandHistory;
    document.body.appendChild(element);
  })

  afterEach(() => {
    document.body.removeChild(element);
    vi.clearAllMocks();
  });

  it('should render initial empty state correctly', () => {
    const heading = element.querySelector('h3.commands-heading');
    const resetButton = element.querySelector('button.outline');
    const commandsList = element.querySelector('.commands-list');
    
    expect(heading?.textContent).toBe('Command History');
    expect(resetButton?.textContent).toBe('Reset');
    expect(commandsList).toBeTruthy();
    expect(commandsList?.children.length).toBe(0);
  });

  it('should add commands to history when command:execute event is emitted', async () => {
    const emitSpy = vi.spyOn(eventBus, 'emit');
    
    eventBus.emit('command:execute', 'forward(100)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const commandItems = element.querySelectorAll('.command-item');
    expect(commandItems.length).toBe(1);
    expect(commandItems[0]?.textContent).toBe('forward(100)');
    expect(emitSpy).toHaveBeenCalledWith('turtle:draw', ['forward(100)']);
  });

  it('should accumulate multiple commands in history', async () => {
    eventBus.emit('command:execute', 'forward(100)');
    eventBus.emit('command:execute', 'right(90)');
    eventBus.emit('command:execute', 'forward(50)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const commandItems = element.querySelectorAll('.command-item');
    expect(commandItems.length).toBe(3);
    expect(commandItems[0]?.textContent).toBe('forward(100)');
    expect(commandItems[1]?.textContent).toBe('right(90)');
    expect(commandItems[2]?.textContent).toBe('forward(50)');
  });

  it('should clear history when reset button is clicked', async () => {
    // Add some commands first
    eventBus.emit('command:execute', 'forward(100)');
    eventBus.emit('command:execute', 'right(90)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Find and click reset button
    const resetButton = element.querySelector('button.outline') as HTMLButtonElement;
    expect(resetButton).toBeTruthy();
    resetButton.click();
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify history is cleared
    const commandItems = element.querySelectorAll('.command-item');
    expect(commandItems.length).toBe(0);
  });

  it('should clear history when reset event is received', async () => {
    // Add some commands first
    eventBus.emit('command:execute', 'forward(100)');
    eventBus.emit('command:execute', 'right(90)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit reset event
    eventBus.emit('reset', null);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify history is cleared
    const commandItems = element.querySelectorAll('.command-item');
    expect(commandItems.length).toBe(0);
  });
});