export interface QueueDriver {
  enqueue<T>(queue: string, item: T): Promise<void>;
  dequeue<T>(queue: string): Promise<T | null>;
  size(queue: string): Promise<number>;
}
