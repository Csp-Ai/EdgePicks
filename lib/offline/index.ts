import { toast } from '../ui/toast';
import { enqueueToast, flushToastQueue, QueuedToast } from './queue';

export function initOfflineQueue() {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', () =>
    flushToastQueue((t) =>
      t.type === 'error' ? toast.error(t.message) : toast.success(t.message),
    ),
  );
}

export function queueToast(toastData: QueuedToast) {
  if (navigator.onLine) {
    toastData.type === 'error'
      ? toast.error(toastData.message)
      : toast.success(toastData.message);
  } else {
    enqueueToast(toastData);
  }
}
