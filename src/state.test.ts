import { describe, it, expect } from 'vitest';
import { Store } from './state';

describe('Store', () => {
  it('should initialize with default state', () => {
    const store = new Store({ commandResult: null });
    expect(store.get()).toEqual({ commandResult: null });
  });
});
