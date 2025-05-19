type EventMap = {
  "command:execute": string;
  reset: null;
};

type EventCallback<T> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown>> {
  private listeners: {
    [K in keyof Events]?: Set<EventCallback<Events[K]>>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>,
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(callback);
    return () => {
      this.listeners[event]!.delete(callback);
    };
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach((cb) => {
      cb(payload);
    });
  }

  off<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>,
  ): void {
    this.listeners[event]?.delete(callback);
  }

  clear<K extends keyof Events>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      (Object.keys(this.listeners) as Array<keyof Events>).forEach((key) => {
        delete this.listeners[key];
      });
    }
  }
}

export const eventBus = new EventBus<EventMap>();
