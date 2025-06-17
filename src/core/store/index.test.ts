import { describe, it, expect } from 'vitest';
import { Store } from '.';

describe('Store', () => {
  it('should initialize with default state', () => {
    const store = new Store({ commandResult: null, language: 'en' });
    expect(store.get()).toEqual({ commandResult: null, language: 'en' });
  });
});
