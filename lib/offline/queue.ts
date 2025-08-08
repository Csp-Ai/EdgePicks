export interface QueuedToast {
  message: string;
  type?: 'success' | 'error';
}

const QUEUE_KEY = 'offline-toast-queue';

export function enqueueToast(toast: QueuedToast) {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(QUEUE_KEY);
  const queue: QueuedToast[] = existing ? JSON.parse(existing) : [];
  queue.push(toast);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function flushToastQueue(handler: (toast: QueuedToast) => void) {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(QUEUE_KEY);
  if (!existing) return;
  const queue: QueuedToast[] = JSON.parse(existing);
  queue.forEach(handler);
  localStorage.removeItem(QUEUE_KEY);
}
