type AppState = {
  commandResult: string | null;
  language: string;
};

type StateListener = () => void;

export class Store {
  private state: AppState;
  private listeners = new Set<StateListener>();
  private readonly STORAGE_KEY = "turtle_storm_state";

  constructor(initial: AppState) {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.state = saved ? JSON.parse(saved) : initial;
  }

  get(): AppState {
    return this.state;
  }

  set(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial };
    this.persist();
    this.notify();
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  private persist() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = { commandResult: null, language: 'en' };
    this.notify();
  }
}

// Global store instance
export const store = new Store({ commandResult: null, language: 'en' });
