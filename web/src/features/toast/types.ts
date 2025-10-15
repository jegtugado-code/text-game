export type ToastItemSeverity = 'info' | 'success' | 'warning' | 'error';

export type ToastItemStyle = 'outline' | 'soft' | 'dash';

export interface ToastItem {
  id: string;
  severity?: ToastItemSeverity;
  style?: ToastItemStyle;
  text: string;
  duration?: number; // Duration in milliseconds, defaults to 5000
}

export interface ToastContextValue {
  items: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface ToastHelperOptions {
  duration?: number;
  style?: ToastItemStyle;
}
