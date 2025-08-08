import { triggerToast } from '../useToast';
import { enqueueToast, flushToastQueue, QueuedToast } from './queue';

export function initOfflineQueue() {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', () => flushToastQueue(triggerToast));
}

export function queueToast(toast: QueuedToast) {
  if (navigator.onLine) {
    triggerToast(toast);
  } else {
    enqueueToast(toast);
  }
}
