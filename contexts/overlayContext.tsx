import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Portal } from 'react-native-paper';

import { FloatingWindow } from '@/components/overlay/floatingWindow';
import { LoaderOverlay } from '@/components/overlay/loaderOverlay';
import { OverlayDialog } from '@/components/overlay/overlayDialog';
import { OverlayModal } from '@/components/overlay/overlayModal';
import { OverlayToast } from '@/components/overlay/overlayToast';
import { SidePanel } from '@/components/overlay/sidePanel';
import {
  type ConfirmOptions,
  type ModalVariant,
  type OverlayApi,
  type PanelOptions,
  type ToastOptions,
} from '@/contexts/overlayTypes';
import { useAppTheme } from '@/hooks/useAppTheme';

/* -------------------------------------------------------------------------- */
/*  Internal state shapes                                                     */
/* -------------------------------------------------------------------------- */

type DialogState = ConfirmOptions & {
  id: string;
  kind: 'alert' | 'confirm';
  resolve: (confirmed: boolean) => void;
  /** Set once resolved so the dialog animates out before unmounting. */
  closing?: boolean;
};

type ToastState = Required<Pick<ToastOptions, 'message' | 'variant'>> & {
  id: string;
  duration?: number;
  /** Set once dismissed so the toast animates out before unmounting. */
  closing?: boolean;
};

type ModalState = {
  id: string;
  variant: ModalVariant;
  title?: string;
  dismissable: boolean;
  content: ReactNode;
  resolve: (result: unknown) => void;
  /** Set once resolved so the modal animates out before unmounting. */
  closing?: boolean;
};

type WindowState = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: ReactNode;
};

type LoaderState = {
  id: string;
  message?: string;
};

type PanelState = {
  id: string;
  title?: string;
  width: number;
  dismissable: boolean;
  content: ReactNode;
};

const DEFAULT_TOAST_DURATION = 4000;
const DEFAULT_PANEL_WIDTH = 420;
const PANEL_ANIM_MS = 240;
const Z = { window: 1000, toast: 2000, modal: 3000, dialog: 4000, loader: 5000 };

/** `transition` is a web-only style absent from RN's ViewStyle typings. */
const panelTransition: ViewStyle = {
  transition: `width ${PANEL_ANIM_MS}ms ease`,
} as unknown as ViewStyle;

const OverlayContext = createContext<OverlayApi | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const { tokens } = useAppTheme();

  // Dialogs are queued; only the first is shown at a time.
  const [dialogs, setDialogs] = useState<DialogState[]>([]);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [modals, setModals] = useState<ModalState[]>([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  // Window stacking order (ids, back-to-front). Last = focused/top.
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  // Loaders stack; the overlay shows while any are active.
  const [loaders, setLoaders] = useState<LoaderState[]>([]);
  // A single docked detail panel. `panelOpen` drives the width animation; the
  // content lingers through the close transition before unmounting.
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const idRef = useRef(0);
  const nextId = useCallback((prefix: string) => `${prefix}-${++idRef.current}`, []);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /* ----------------------------- Toasts -------------------------------- */

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  // Flag the toast as closing so it animates out; the component unmounts it via
  // `onExited` once the exit transition settles.
  const dismissToast = useCallback((id: string) => {
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast)),
    );
  }, []);

  const toast = useCallback(
    ({ message, variant = 'info', duration }: ToastOptions) => {
      const id = nextId('toast');
      setToasts((current) => [...current, { id, message, variant, duration }]);
      timers.current[id] = setTimeout(
        () => dismissToast(id),
        duration ?? DEFAULT_TOAST_DURATION,
      );
      return id;
    },
    [dismissToast, nextId],
  );

  const updateToast = useCallback((id: string, patch: Partial<ToastOptions>) => {
    setToasts((current) =>
      current.map((existing) =>
        existing.id === id ? { ...existing, ...patch } : existing,
      ),
    );
  }, []);

  /* ----------------------------- Loader -------------------------------- */

  const showLoader = useCallback(
    (message?: string) => {
      const id = nextId('loader');
      setLoaders((current) => [...current, { id, message }]);
      return id;
    },
    [nextId],
  );

  const hideLoader = useCallback((id: string) => {
    setLoaders((current) => current.filter((loader) => loader.id !== id));
  }, []);

  const withLoader = useCallback(
    async <T,>(work: Promise<T>, message?: string) => {
      const id = showLoader(message);
      try {
        return await work;
      } finally {
        hideLoader(id);
      }
    },
    [hideLoader, showLoader],
  );

  /* ----------------------------- Dialogs ------------------------------- */

  const enqueueDialog = useCallback(
    (dialog: Omit<DialogState, 'id'>) => {
      const id = nextId('dialog');
      setDialogs((current) => [...current, { ...dialog, id }]);
    },
    [nextId],
  );

  // Resolve the active dialog and flag it as closing; it stays at the head of
  // the queue (blocking the next one) until its exit transition unmounts it.
  const resolveActiveDialog = useCallback((confirmed: boolean) => {
    setDialogs((current) => {
      const [active, ...rest] = current;
      if (!active || active.closing) return current;
      active.resolve(confirmed);
      return [{ ...active, closing: true }, ...rest];
    });
  }, []);

  const removeDialog = useCallback((id: string) => {
    setDialogs((current) => current.filter((dialog) => dialog.id !== id));
  }, []);

  const alert = useCallback(
    (options: ConfirmOptions) =>
      new Promise<void>((resolve) => {
        enqueueDialog({ ...options, kind: 'alert', resolve: () => resolve() });
      }),
    [enqueueDialog],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        enqueueDialog({ ...options, kind: 'confirm', resolve });
      }),
    [enqueueDialog],
  );

  /* ----------------------------- Modals -------------------------------- */

  const removeModal = useCallback((id: string) => {
    setModals((current) => current.filter((modal) => modal.id !== id));
  }, []);

  // Resolve the modal's promise immediately, then flag it as closing so it
  // animates out; the component unmounts it via `onExited`.
  const closeModal = useCallback((id: string, result: unknown) => {
    setModals((current) => {
      const target = current.find((modal) => modal.id === id);
      if (!target || target.closing) return current;
      target.resolve(result);
      return current.map((modal) =>
        modal.id === id ? { ...modal, closing: true } : modal,
      );
    });
  }, []);

  const modal = useCallback(
    <T,>(options: {
      title?: string;
      variant?: ModalVariant;
      dismissable?: boolean;
      render: (close: (result?: T) => void) => ReactNode;
    }) =>
      new Promise<T | undefined>((resolve) => {
        const id = nextId('modal');
        const close = (result?: T) => closeModal(id, result);
        setModals((current) => [
          ...current,
          {
            id,
            title: options.title,
            variant: options.variant ?? 'standard',
            dismissable: options.dismissable ?? true,
            content: options.render(close),
            resolve: resolve as (result: unknown) => void,
          },
        ]);
      }),
    [closeModal, nextId],
  );

  /* ----------------------------- Windows ------------------------------- */

  const focusWindow = useCallback((id: string) => {
    setWindowOrder((order) => [...order.filter((wid) => wid !== id), id]);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((current) => current.filter((win) => win.id !== id));
    setWindowOrder((order) => order.filter((wid) => wid !== id));
  }, []);

  const openWindow = useCallback<OverlayApi['openWindow']>(
    (options) => {
      const id = nextId('window');
      const offset = (idRef.current % 5) * 28;
      setWindows((current) => [
        ...current,
        {
          id,
          title: options.title,
          x: options.x ?? 80 + offset,
          y: options.y ?? 80 + offset,
          width: options.width ?? 360,
          height: options.height ?? 260,
          content: options.render({ close: () => closeWindow(id) }),
        },
      ]);
      setWindowOrder((order) => [...order, id]);
      return id;
    },
    [closeWindow, nextId],
  );

  /* ------------------------------ Panel -------------------------------- */

  const closePanel = useCallback((id?: string) => {
    setPanel((current) => {
      if (!current || (id && current.id !== id)) return current;
      if (panelTimer.current) clearTimeout(panelTimer.current);
      setPanelOpen(false);
      // Keep content mounted through the slide-out, then unmount.
      panelTimer.current = setTimeout(() => setPanel(null), PANEL_ANIM_MS);
      return current;
    });
  }, []);

  const openPanel = useCallback<OverlayApi['openPanel']>(
    (options) => {
      const id = nextId('panel');
      if (panelTimer.current) clearTimeout(panelTimer.current);
      setPanel({
        id,
        title: options.title,
        width: options.width ?? DEFAULT_PANEL_WIDTH,
        dismissable: options.dismissable ?? true,
        content: options.render({ close: () => closePanel(id) }),
      });
      // Open from a collapsed width on the next frame so the width transitions.
      requestAnimationFrame(() => setPanelOpen(true));
      return id;
    },
    [closePanel, nextId],
  );

  /* --------------------------- Cleanup --------------------------------- */

  useEffect(() => {
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach(clearTimeout);
      if (panelTimer.current) clearTimeout(panelTimer.current);
    };
  }, []);

  const api = useMemo<OverlayApi>(
    () => ({
      alert,
      confirm,
      toast,
      dismissToast,
      updateToast,
      showLoader,
      hideLoader,
      withLoader,
      modal,
      openWindow,
      closeWindow,
      openPanel,
      closePanel,
    }),
    [
      alert,
      confirm,
      toast,
      dismissToast,
      updateToast,
      showLoader,
      hideLoader,
      withLoader,
      modal,
      openWindow,
      closeWindow,
      openPanel,
      closePanel,
    ],
  );

  const activeDialog = dialogs[0];
  const focusedWindowId = windowOrder[windowOrder.length - 1];
  const panelWidth = panel?.width ?? DEFAULT_PANEL_WIDTH;

  return (
    <OverlayContext.Provider value={api}>
      {/* Layout row: main content is pushed left when a panel is docked. */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
        <View
          style={[
            { width: panelOpen ? panelWidth : 0, overflow: 'hidden' },
            panelTransition,
          ]}
        >
          {panel ? (
            <SidePanel
              title={panel.title}
              width={panelWidth}
              dismissable={panel.dismissable}
              onClose={() => closePanel(panel.id)}
            >
              {panel.content}
            </SidePanel>
          ) : null}
        </View>
      </View>

      <Portal>
        {/* Windows (lowest overlay layer) */}
        {windows.map((win) => {
          const orderIndex = windowOrder.indexOf(win.id);
          return (
            <FloatingWindow
              key={win.id}
              title={win.title}
              initialX={win.x}
              initialY={win.y}
              initialWidth={win.width}
              initialHeight={win.height}
              zIndex={Z.window + (orderIndex < 0 ? 0 : orderIndex)}
              focused={win.id === focusedWindowId}
              onFocus={() => focusWindow(win.id)}
              onClose={() => closeWindow(win.id)}
            >
              {win.content}
            </FloatingWindow>
          );
        })}

        {/* Toasts (top-right stack) */}
        {toasts.length > 0 ? (
          <View
            pointerEvents="box-none"
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: Z.toast,
                alignItems: 'flex-end',
                paddingTop: tokens.spacing.xl,
                paddingHorizontal: tokens.spacing.lg,
                gap: tokens.spacing.sm,
              },
            ]}
          >
            {toasts.map((item) => (
              <OverlayToast
                key={item.id}
                variant={item.variant}
                message={item.message}
                visible={!item.closing}
                onDismiss={() => dismissToast(item.id)}
                onExited={() => removeToast(item.id)}
              />
            ))}
          </View>
        ) : null}

        {/* Modals (stacked, each blocking) */}
        {modals.map((item) => (
          <View key={item.id} style={[StyleSheet.absoluteFill, { zIndex: Z.modal }]}>
            <OverlayModal
              variant={item.variant}
              title={item.title}
              dismissable={item.dismissable}
              visible={!item.closing}
              onDismiss={() => closeModal(item.id, undefined)}
              onExited={() => removeModal(item.id)}
            >
              {item.content}
            </OverlayModal>
          </View>
        ))}

        {/* Active dialog (highest layer) */}
        {activeDialog ? (
          <View style={[StyleSheet.absoluteFill, { zIndex: Z.dialog }]}>
            <OverlayDialog
              variant={activeDialog.variant ?? 'info'}
              title={activeDialog.title}
              message={activeDialog.message}
              confirmLabel={activeDialog.confirmLabel ?? 'OK'}
              cancelLabel={
                activeDialog.kind === 'confirm'
                  ? (activeDialog.cancelLabel ?? 'Cancel')
                  : undefined
              }
              destructive={activeDialog.destructive}
              visible={!activeDialog.closing}
              onConfirm={() => resolveActiveDialog(true)}
              onCancel={
                activeDialog.kind === 'confirm'
                  ? () => resolveActiveDialog(false)
                  : undefined
              }
              onExited={() => removeDialog(activeDialog.id)}
            />
          </View>
        ) : null}

        {/* Loader (blocks everything while active) */}
        {loaders.length > 0 ? (
          <View style={[StyleSheet.absoluteFill, { zIndex: Z.loader }]}>
            <LoaderOverlay message={loaders[loaders.length - 1].message} />
          </View>
        ) : null}
      </Portal>
    </OverlayContext.Provider>
  );
}

export function useOverlay(): OverlayApi {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
