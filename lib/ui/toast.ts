export type ToastType = 'success' | 'error' | 'progress';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export type ToastHandler = (toast: Toast) => void;

const listeners = new Set<ToastHandler>();

function emit(toast: Toast) {
  listeners.forEach((l) => l(toast));
}

function genId() {
  return Date.now() + Math.random();
}

export const toast = {
  success(message: string) {
    emit({ id: genId(), message, type: 'success' });
  },
  error(message: string) {
    emit({ id: genId(), message, type: 'error' });
  },
  promise<T>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) {
    const id = genId();
    emit({ id, message: msgs.loading, type: 'progress' });
    promise
      .then(() => emit({ id, message: msgs.success, type: 'success' }))
      .catch(() => emit({ id, message: msgs.error, type: 'error' }));
  },
  subscribe(handler: ToastHandler) {
    listeners.add(handler);
    return () => listeners.delete(handler);
  },
};
