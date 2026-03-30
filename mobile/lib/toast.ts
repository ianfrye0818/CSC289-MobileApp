// src/lib/toast.ts
import Toast, { type ToastShowParams } from 'react-native-toast-message';

/**
 * Default display options applied to every toast unless overridden.
 * - `position: 'top'` — toasts appear at the top of the screen.
 * - `visibilityTime: 3000` — auto-dismiss after 3 seconds.
 * - `topOffset: 60` — leaves room for the status bar / notch.
 */
const defaults: ToastShowParams = {
  position: 'top',
  visibilityTime: 3000,
  autoHide: true,
  topOffset: 60,
};

/**
 * Thin wrapper around `react-native-toast-message` that applies consistent
 * defaults across the whole app.
 *
 * Each method maps to one of the custom toast types defined in `ToastConfig.tsx`.
 * Pass an optional `options` object to override defaults (e.g. a longer
 * `visibilityTime` for an important error message).
 *
 * @example
 * // Show a success toast
 * appToast.success('Saved!', 'Your changes were saved.');
 *
 * // Show a loading toast while awaiting an async action, then hide it
 * appToast.loading('Processing…');
 * await placeOrder();
 * appToast.hide();
 */
export const appToast = {
  /** Show a green success toast. */
  success: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'success', text1, text2 }),

  /** Show a red error toast. */
  error: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'error', text1, text2 }),

  /** Show a blue informational toast. */
  info: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'info', text1, text2 }),

  /** Show an amber warning toast. */
  warning: (message: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'warning', text1: message, text2 }),

  /**
   * Show an indigo loading toast that does NOT auto-hide.
   * Call `appToast.hide()` once the async operation completes.
   */
  loading: (text1: string, text2?: string, options?: ToastShowParams) =>
    Toast.show({ ...defaults, ...options, type: 'loading', text1, text2, autoHide: false }),

  /** Programmatically dismiss the currently visible toast. */
  hide: () => Toast.hide(),
};
