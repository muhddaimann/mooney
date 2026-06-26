import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Portal,
  Snackbar,
  Text,
} from 'react-native-paper';
import { useDesign } from './designContext';

/* -------------------------------------------------------------------------- */
/*  Public types                                                              */
/* -------------------------------------------------------------------------- */

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type AlertOptions = {
  title?: string;
  message: string;
  /** Label for the single dismiss button. Defaults to "OK". */
  confirmLabel?: string;
};

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm action as destructive (error color). */
  destructive?: boolean;
};

export type ModalOptions = {
  /** Allow tap-outside / back to dismiss. Defaults to true. */
  dismissable?: boolean;
};

export type ToastOptions = {
  message: string;
  type?: ToastType;
  /** Auto-hide delay in ms. Defaults to 3500. */
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

export type OverlayContextValue = {
  /** Show a blocking, full-screen loading spinner with an optional message. */
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  /** Promise-based alert — resolves when dismissed. */
  alert: (options: AlertOptions) => Promise<void>;
  /** Promise-based confirm — resolves true (confirm) / false (cancel/dismiss). */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Render arbitrary content in a centered themed modal. */
  showModal: (content: React.ReactNode, options?: ModalOptions) => void;
  hideModal: () => void;
  /** Transient bottom snackbar. Pass a string for a default info toast. */
  toast: (options: ToastOptions | string) => void;
  hideToast: () => void;
};

/* -------------------------------------------------------------------------- */
/*  Internal state                                                            */
/* -------------------------------------------------------------------------- */

type DialogState = {
  visible: boolean;
  kind: 'alert' | 'confirm';
  title?: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
};

type ModalState = {
  visible: boolean;
  content: React.ReactNode;
  dismissable: boolean;
};

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colors, spacing, radii, fonts, fontSize, dimensions, shadow, opacity } =
    useDesign();

  const [loading, setLoading] = useState<{ visible: boolean; message?: string }>({
    visible: false,
  });
  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    kind: 'alert',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    destructive: false,
  });
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    content: null,
    dismissable: true,
  });
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    duration: 3500,
  });

  // Pending promise resolver for the active dialog.
  const dialogResolve = useRef<((value: boolean) => void) | null>(null);

  /* ------------------------------- loading ------------------------------- */

  const showLoading = useCallback((message?: string) => {
    setLoading({ visible: true, message });
  }, []);
  const hideLoading = useCallback(() => setLoading({ visible: false }), []);

  /* ----------------------------- alert / confirm ------------------------- */

  const settleDialog = useCallback((result: boolean) => {
    setDialog((d) => ({ ...d, visible: false }));
    dialogResolve.current?.(result);
    dialogResolve.current = null;
  }, []);

  const alert = useCallback(
    (options: AlertOptions) =>
      new Promise<void>((resolve) => {
        dialogResolve.current = () => resolve();
        setDialog({
          visible: true,
          kind: 'alert',
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? 'OK',
          cancelLabel: 'Cancel',
          destructive: false,
        });
      }),
    [],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        dialogResolve.current = resolve;
        setDialog({
          visible: true,
          kind: 'confirm',
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? 'Confirm',
          cancelLabel: options.cancelLabel ?? 'Cancel',
          destructive: options.destructive ?? false,
        });
      }),
    [],
  );

  /* -------------------------------- modal -------------------------------- */

  const showModal = useCallback(
    (content: React.ReactNode, options?: ModalOptions) => {
      setModal({
        visible: true,
        content,
        dismissable: options?.dismissable ?? true,
      });
    },
    [],
  );
  const hideModal = useCallback(
    () => setModal((m) => ({ ...m, visible: false })),
    [],
  );

  /* -------------------------------- toast -------------------------------- */

  const toast = useCallback((options: ToastOptions | string) => {
    const opts: ToastOptions =
      typeof options === 'string' ? { message: options } : options;
    setToastState({
      visible: true,
      message: opts.message,
      type: opts.type ?? 'info',
      duration: opts.duration ?? 3500,
      actionLabel: opts.actionLabel,
      onAction: opts.onAction,
    });
  }, []);
  const hideToast = useCallback(
    () => setToastState((t) => ({ ...t, visible: false })),
    [],
  );

  const value = useMemo<OverlayContextValue>(
    () => ({
      showLoading,
      hideLoading,
      alert,
      confirm,
      showModal,
      hideModal,
      toast,
      hideToast,
    }),
    [showLoading, hideLoading, alert, confirm, showModal, hideModal, toast, hideToast],
  );

  const toastColors: Record<ToastType, string> = {
    info: colors.surfaceHover,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  return (
    <OverlayContext.Provider value={value}>
      {children}

      <Portal>
        {/* ----------------------------- Loading ----------------------------- */}
        {loading.visible && (
          <View
            style={[StyleSheet.absoluteFill, styles.loadingRoot, { backgroundColor: colors.overlay }]}
            pointerEvents="auto"
          >
            <ActivityIndicator size="large" color={colors.primary} />
            {loading.message ? (
              <Text
                style={{
                  marginTop: spacing.md,
                  color: colors.text,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.base,
                }}
              >
                {loading.message}
              </Text>
            ) : null}
          </View>
        )}

        {/* ------------------------- Alert / Confirm ------------------------- */}
        <Dialog
          visible={dialog.visible}
          dismissable={dialog.kind === 'confirm'}
          onDismiss={() => settleDialog(false)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            alignSelf: 'center',
            width: '100%',
            maxWidth: dimensions.cardMaxWidth,
          }}
        >
          {dialog.title ? (
            <Dialog.Title
              style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg }}
            >
              {dialog.title}
            </Dialog.Title>
          ) : null}
          <Dialog.Content>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.base,
              }}
            >
              {dialog.message}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            {dialog.kind === 'confirm' && (
              <Button
                onPress={() => settleDialog(false)}
                textColor={colors.textSecondary}
                labelStyle={{ fontFamily: fonts.semibold }}
              >
                {dialog.cancelLabel}
              </Button>
            )}
            <Button
              onPress={() => settleDialog(true)}
              textColor={dialog.destructive ? colors.error : colors.primary}
              labelStyle={{ fontFamily: fonts.bold }}
            >
              {dialog.confirmLabel}
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* ------------------------------- Modal ----------------------------- */}
        <Modal
          visible={modal.visible}
          dismissable={modal.dismissable}
          onDismiss={hideModal}
          contentContainerStyle={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: dimensions.cardMaxWidth,
            margin: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            ...shadow.xl,
          }}
        >
          {modal.content}
        </Modal>

        {/* ------------------------------- Toast ----------------------------- */}
        <Snackbar
          visible={toastState.visible}
          onDismiss={hideToast}
          duration={toastState.duration}
          style={{
            backgroundColor: toastColors[toastState.type],
            borderRadius: radii.md,
            alignSelf: 'center',
            width: '100%',
            maxWidth: 480,
          }}
          action={
            toastState.actionLabel
              ? {
                  label: toastState.actionLabel,
                  textColor: colors.onPrimary,
                  onPress: () => toastState.onAction?.(),
                }
              : undefined
          }
        >
          <Text style={{ color: colors.onPrimary, fontFamily: fonts.semibold, opacity: opacity.full }}>
            {toastState.message}
          </Text>
        </Snackbar>
      </Portal>
    </OverlayContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingRoot: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});

export const useOverlay = (): OverlayContextValue => {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error('useOverlay must be used within an <OverlayProvider>');
  }
  return ctx;
};
