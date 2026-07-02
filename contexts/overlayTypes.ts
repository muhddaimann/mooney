import { type ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*  Variants                                                                  */
/* -------------------------------------------------------------------------- */

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastVariant = AlertVariant;
export type ModalVariant = 'standard' | 'form' | 'fullscreen' | 'bottom-sheet';

/* -------------------------------------------------------------------------- */
/*  Public option shapes (what callers pass to the API)                       */
/* -------------------------------------------------------------------------- */

export type AlertOptions = {
  title?: string;
  message: string;
  variant?: AlertVariant;
  confirmLabel?: string;
};

export type ConfirmOptions = AlertOptions & {
  cancelLabel?: string;
  /** Styles the confirm action as destructive (error color). */
  destructive?: boolean;
};

export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Tapping the toast dismisses it early. */
  duration?: number;
};

export type ModalOptions<T = unknown> = {
  title?: string;
  variant?: ModalVariant;
  /** Allow backdrop / escape dismissal. Defaults to true. */
  dismissable?: boolean;
  /** Render body content; call `close(result)` to resolve the modal promise. */
  render: (close: (result?: T) => void) => ReactNode;
};

export type WindowOptions = {
  title: string;
  render: (controls: { close: () => void }) => ReactNode;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
};

export type PanelOptions = {
  title?: string;
  /** Panel width in px. Defaults to 420. */
  width?: number;
  /** Show a close button and allow dismissal. Defaults to true. */
  dismissable?: boolean;
  render: (controls: { close: () => void }) => ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export type OverlayApi = {
  /** Show a single-action notice. Resolves when acknowledged. */
  alert: (options: AlertOptions) => Promise<void>;
  /** Ask a yes/no question. Resolves true (confirm) or false (cancel). */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Show a transient toast (auto-dismiss; tap to dismiss). Returns its id. */
  toast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  /** Patch an existing toast. */
  updateToast: (id: string, patch: Partial<ToastOptions>) => void;
  /** Show a blocking, blurred loading overlay. Returns its id. */
  showLoader: (message?: string) => string;
  hideLoader: (id: string) => void;
  /** Run async work behind a loader, hiding it when the promise settles. */
  withLoader: <T>(work: Promise<T>, message?: string) => Promise<T>;
  /** Open a custom modal. Resolves with the value passed to `close`. */
  modal: <T = unknown>(options: ModalOptions<T>) => Promise<T | undefined>;
  /** Open a draggable, resizable floating window. Returns its id. */
  openWindow: (options: WindowOptions) => string;
  closeWindow: (id: string) => void;
  /** Open a docked detail panel; app content shifts left to reveal it. */
  openPanel: (options: PanelOptions) => string;
  /** Close the panel (optionally only if `id` matches the open one). */
  closePanel: (id?: string) => void;
};
