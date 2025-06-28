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
    
    const commandText = commandsList?.children[0].querySelector('.command-text');
    expect(commandText?.textContent).toBe('forward(100)');
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

  it('should have redo and delete buttons for each command', async () => {
    const eventBus = serviceProvider.getEventBus();
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit a command
    eventBus.emit('command:execute', 'forward(100)');
    
    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const commandItem = element.querySelector('.history-command-item');
    const redoButton = commandItem?.querySelector('.redo-button');
    const deleteButton = commandItem?.querySelector('.delete-button');
    
    expect(redoButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(redoButton?.innerHTML).toBe('🔄');
    expect(deleteButton?.innerHTML).toBe('🗑️');
  });

  it('should redo command when redo button is clicked', async () => {
    const eventBus = serviceProvider.getEventBus();
    const commandExecuteSpy = vi.spyOn(eventBus, 'emit');
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit a command
    eventBus.emit('command:execute', 'forward(100)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Clear the spy to only capture the redo action
    commandExecuteSpy.mockClear();
    
    // Click redo button
    const redoButton = element.querySelector('.redo-button') as HTMLButtonElement;
    redoButton.click();
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(commandExecuteSpy).toHaveBeenCalledWith('command:execute', 'forward(100)');
  });

  it('should delete command when delete button is clicked', async () => {
    const eventBus = serviceProvider.getEventBus();
    const turtleDrawSpy = vi.spyOn(eventBus, 'emit');
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit two commands
    eventBus.emit('command:execute', 'forward(100)');
    eventBus.emit('command:execute', 'right(90)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify we have two commands
    const commandsList = element.querySelector('.commands-list');
    expect(commandsList?.children.length).toBe(2);
    
    // Clear the spy to only capture the delete action
    turtleDrawSpy.mockClear();
    
    // Click delete button on the first command
    const firstDeleteButton = commandsList?.children[0].querySelector('.delete-button') as HTMLButtonElement;
    firstDeleteButton.click();
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify the command was deleted
    expect(commandsList?.children.length).toBe(1);
    expect(turtleDrawSpy).toHaveBeenCalledWith('turtle:draw', ['right(90)']);
  });

  it('should execute commands after deleting a command', async () => {
    const eventBus = serviceProvider.getEventBus();
    const turtleDrawSpy = vi.spyOn(eventBus, 'emit');
    
    // Wait for initial render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Emit three commands
    eventBus.emit('command:execute', 'forward(100)');
    eventBus.emit('command:execute', 'right(90)');
    eventBus.emit('command:execute', 'forward(50)');
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Clear the spy
    turtleDrawSpy.mockClear();
    
    // Delete the middle command
    const commandsList = element.querySelector('.commands-list');
    const secondDeleteButton = commandsList?.children[1].querySelector('.delete-button') as HTMLButtonElement;
    secondDeleteButton.click();
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify the remaining commands are executed
    expect(turtleDrawSpy).toHaveBeenCalledWith('turtle:draw', ['forward(100)', 'forward(50)']);
  });
});