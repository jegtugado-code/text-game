import { createContext } from 'react';

import type { ToastItem } from '../interfaces/toast-item';

export interface ToastContextValue {
  items: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined
);
