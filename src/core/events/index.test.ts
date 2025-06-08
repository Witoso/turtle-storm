import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '.';

describe('EventBus', () => {
  let eventBus: EventBus<{
    'test:event': string;
    'another:event': number;
  }>;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should allow subscribing to events', () => {
    const callback = vi.fn();
    eventBus.on('test:event', callback);
    
    eventBus.emit('test:event', 'test');
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should allow unsubscribing from events', () => {
    const callback = vi.fn();
    const unsubscribe = eventBus.on('test:event', callback);
    
    unsubscribe();
    eventBus.emit('test:event', 'test');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple subscribers', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.on('test:event', callback1);
    eventBus.on('test:event', callback2);
    
    eventBus.emit('test:event', 'test');
    
    expect(callback1).toHaveBeenCalledWith('test');
    expect(callback2).toHaveBeenCalledWith('test');
  });

  it('should clear all listeners for specific event', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.on('test:event', callback1);
    eventBus.on('another:event', callback2);
    
    eventBus.clear('test:event');
    
    eventBus.emit('test:event', 'test');
    eventBus.emit('another:event', 42);
    
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(42);
  });
});
