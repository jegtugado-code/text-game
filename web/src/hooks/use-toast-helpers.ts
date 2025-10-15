import { useCallback } from 'react';

import type { ToastItemStyle } from '../types/toast-item-style';

import { useToast } from './use-toast';

export interface ToastHelperOptions {
  duration?: number;
  style?: ToastItemStyle;
}
// Convenience functions for common toast types
export function useToastHelpers() {
  const { addToast } = useToast();

  const showToast = useCallback(
    (text: string, options?: ToastHelperOptions) => {
      return addToast({
        text,
        ...options,
      });
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (text: string, options?: ToastHelperOptions) => {
      return addToast({
        severity: 'success',
        text,
        ...options,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (text: string, options?: ToastHelperOptions) => {
      return addToast({
        severity: 'error',
        text,
        ...options,
      });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (text: string, options?: ToastHelperOptions) => {
      return addToast({
        severity: 'warning',
        text,
        ...options,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (text: string, options?: ToastHelperOptions) => {
      return addToast({
        severity: 'info',
        text,
        ...options,
      });
    },
    [addToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
