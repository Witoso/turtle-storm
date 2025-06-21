import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommandHistory } from '.';
import { serviceProvider } from '../../core/services';

describe('CommandHistory', () => {
  let element: CommandHistory;

  beforeEach(async () => {
    // Initialize the service provider
    if (!serviceProvider.isInitialized()) {
      serviceProvider.initialize();
    }
    
    // Define the custom element before creating it
    if (!customElements.get('command-history')) {
      customElements.define('command-history', CommandHistory);
    }
    
    element = document.createElement('command-history') as CommandHistory;
    document.body.appendChild(element);
    
    // Wait for the component to initialize
    await new Promise(resolve => setTimeout(resolve, 10));
  })

  afterEach(() => {
    document.body.removeChild(element);
    vi.clearAllMocks();
  });

  it('should render initial empty state correctly', async () => {
    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const heading = element.querySelector('h3.commands-heading');
    const resetButton = element.querySelector('button.outline');
    const commandsList = element.querySelector('.commands-list');
    
    expect(heading?.textContent).toBe('Command History');
    expect(resetButton?.textContent).toBe('Reset');
    expect(commandsList).toBeTruthy();
    expect(commandsList?.children.length).toBe(0);
  });

  it('should add commands to history when command:execute event is emitted', async () => {
    const eventBus = serviceProvider.getEventBus();
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit a command
    eventBus.emit('command:execute', 'forward(100)');
    
    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const commandsList = element.querySelector('.commands-list');
    expect(commandsList?.children.length).toBe(1);
    expect(commandsList?.children[0].textContent).toBe('forward(100)');
  });

  it('should clear history when reset event is emitted', async () => {
    const eventBus = serviceProvider.getEventBus();
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Add a command first
    eventBus.emit('command:execute', 'forward(100)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify command was added
    const commandsList = element.querySelector('.commands-list');
    expect(commandsList?.children.length).toBe(1);
    
    // Emit reset
    eventBus.emit('reset', null);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify history is cleared
    expect(commandsList?.children.length).toBe(0);
  });

  it('should emit turtle:draw event with command history when command is executed', async () => {
    const eventBus = serviceProvider.getEventBus();
    const turtleDrawSpy = vi.spyOn(eventBus, 'emit');
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit a command
    eventBus.emit('command:execute', 'forward(100)');
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(turtleDrawSpy).toHaveBeenCalledWith('turtle:draw', ['forward(100)']);
  });

  it('should emit turtle:draw event with empty array when reset is clicked', async () => {
    const eventBus = serviceProvider.getEventBus();
    const turtleDrawSpy = vi.spyOn(eventBus, 'emit');
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Click reset button
    const resetButton = element.querySelector('button.outline') as HTMLButtonElement;
    resetButton.click();
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(turtleDrawSpy).toHaveBeenCalledWith('turtle:draw', []);
  });
});