import type { ToastItemSeverity } from '../types/toast-item-severity';
import type { ToastItemStyle } from '../types/toast-item-style';

export interface ToastItem {
  id: string;
  severity?: ToastItemSeverity;
  style?: ToastItemStyle;
  text: string;
  duration?: number; // Duration in milliseconds, defaults to 5000
}
