type AppState = {
  user: { username: string } | null;
  commandResult: string | null;
};

type StateListener = () => void;

export class Store {
  private state: AppState;
  private listeners = new Set<StateListener>();
  private readonly STORAGE_KEY = "appState";

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
    this.state = { user: null, commandResult: null };
    this.notify();
  }
}
