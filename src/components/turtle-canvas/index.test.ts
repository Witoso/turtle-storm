import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TurtleCanvas } from '.';
import { eventBus } from '../../core/events';

describe('TurtleCanvas', () => {
  let element: TurtleCanvas;
  let canvas: HTMLCanvasElement;
  const scale = window.devicePixelRatio || 1;

  beforeEach(() => {
    // Define the custom element before creating it
    if (!customElements.get('turtle-canvas')) {
      customElements.define('turtle-canvas', TurtleCanvas);
    }
    
    canvas = document.createElement('canvas');
    canvas.id = 'turtle-canvas';
    canvas.width = 800 * scale;
    canvas.height = 400 * scale;
    canvas.style.width = '800px';
    canvas.style.height = '400px';
    
    element = document.createElement('turtle-canvas') as TurtleCanvas;
    element.appendChild(canvas);
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create turtle on connection', () => {
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeTruthy();
    
    // Verify canvas is properly set up
    expect(canvas.width).toBe(800 * scale);
    expect(canvas.height).toBe(400 * scale);
    expect(canvas.style.width).toBe('800px');
    expect(canvas.style.height).toBe('400px');
  });

  it('should execute valid turtle commands', async () => {
    // Execute some commands
    eventBus.emit('turtle:draw', ['forward(100)', 'left(90)']);
    
    // Give the turtle time to draw
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if canvas has some content (non-blank pixels)
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const hasNonBlankPixels = Array.from(imageData?.data || []).some(value => value !== 0);
    
    expect(hasNonBlankPixels).toBe(true);
  });

  it('should handle invalid commands gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    eventBus.emit('turtle:draw', ['invalidCommand(100)']);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Invalid command:',
      expect.any(Error)
    );
  });

  it('should reset turtle on reset event', async () => {
    // Draw something first
    eventBus.emit('turtle:draw', ['forward(100)']);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reset the turtle
    eventBus.emit('reset', null);
    
    // Check if canvas is blank
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const isBlank = Array.from(imageData?.data || []).every(value => value === 0);
    
    expect(isBlank).toBe(true);
  });
});
