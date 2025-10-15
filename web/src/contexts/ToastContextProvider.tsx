import { useCallback, useEffect, useState } from 'react';

import type { ToastItem } from '../interfaces/toast-item';

import { ToastContext, type ToastContextValue } from './ToastContext';

interface ToastProviderProps {
  children: React.ReactNode;
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = crypto.randomUUID();
      const newToast: ToastItem = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
      };

      setItems(prev => [...prev, newToast]);
      return id;
    },
    [defaultDuration]
  );

  const removeToast = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setItems([]);
  }, []);

  // Auto-removal effect
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    items.forEach(item => {
      if (item.duration && item.duration > 0) {
        timers[item.id] = setTimeout(() => {
          removeToast(item.id);
        }, item.duration);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [items, removeToast]);

  const value: ToastContextValue = {
    items,
    addToast,
    removeToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
