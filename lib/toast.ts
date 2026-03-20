// src/lib/toast.ts
import Toast, { type ToastShowParams } from 'react-native-toast-message';

const defaults: ToastShowParams = {
  position: 'top',
  visibilityTime: 3000,
  autoHide: true,
  topOffset: 60,
};

export const appToast = {
  success: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'success', text1, text2 }),

  error: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'error', text1, text2 }),

  info: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'info', text1, text2 }),

  warning: (message: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'warning', text1: message, text2 }),

  loading: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'loading', text1, text2, autoHide: false }),

  hide: () => Toast.hide(),
};
