'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast, Toast } from '@/lib/ui/toast';

export const Toaster: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((t) => {
      setToasts((prev) => {
        const idx = prev.findIndex((p) => p.id === t.id);
        const next = [...prev];
        if (idx >= 0) {
          next[idx] = t;
        } else {
          next.push(t);
        }
        return next;
      });
      if (t.type !== 'progress') {
        setTimeout(() => {
          setToasts((prev) => prev.filter((p) => p.id !== t.id));
        }, 3000);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const portal =
    typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`px-3 py-2 rounded shadow text-white ${
                  t.type === 'success'
                    ? 'bg-green-600'
                    : t.type === 'error'
                    ? 'bg-red-600'
                    : 'bg-gray-600'
                }`}
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {children}
      {portal}
    </>
  );
};

export default Toaster;
