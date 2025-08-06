import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error';
}

type AddToast = (toast: Omit<Toast, 'id'>) => void;

const ToastContext = createContext<AddToast>(() => {});

let trigger: AddToast = () => {};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback<AddToast>((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  trigger = addToast;

  const portal =
    typeof document !== 'undefined'
      ? createPortal(
          React.createElement(
            'div',
            { className: 'fixed bottom-4 right-4 space-y-2 z-50' },
            toasts.map((t) =>
              React.createElement(
                'div',
                {
                  key: t.id,
                  className: `px-3 py-2 rounded shadow text-white ${
                    t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                  }`,
                },
                t.message,
              ),
            ),
          ),
          document.body,
        )
      : null;

  return React.createElement(
    ToastContext.Provider,
    { value: addToast },
    children,
    portal,
  );
};

export const useToast = () => useContext(ToastContext);

export const triggerToast: AddToast = (toast) => trigger(toast);
