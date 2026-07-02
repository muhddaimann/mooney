import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { usePresenceAnim } from '@/components/overlay/usePresenceAnim';
import { variantMeta } from '@/components/overlay/variantMeta';
import { type AlertVariant } from '@/contexts/overlayTypes';
import { useAppTheme } from '@/hooks/useAppTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type OverlayDialogProps = {
  variant: AlertVariant;
  title?: string;
  message: string;
  confirmLabel: string;
  /** Present => confirm dialog (shows a cancel action). */
  cancelLabel?: string;
  destructive?: boolean;
  /** Drives the enter/exit transition; false animates out. */
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  /** Called once the exit transition settles, so the owner can unmount. */
  onExited: () => void;
};

/**
 * Centered modal dialog used for both alerts (confirm only) and confirms
 * (confirm + cancel). The variant icon sits as a faint ghost in the top-right
 * corner; backdrop press triggers cancel when cancelable.
 */
export function OverlayDialog({
  variant,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  visible,
  onConfirm,
  onCancel,
  onExited,
}: OverlayDialogProps) {
  const { tokens } = useAppTheme();
  const meta = variantMeta(tokens, variant);
  const progress = usePresenceAnim(visible, onExited);
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: tokens.spacing.lg,
        },
      ]}
    >
      <AnimatedPressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tokens.colors.overlay, opacity: progress },
        ]}
        onPress={onCancel}
        disabled={!onCancel}
      />
      <Animated.View
        style={{
          width: '100%',
          maxWidth: 420,
          opacity: progress,
          transform: [{ scale }],
        }}
      >
        <Card>
          <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
            <MaterialCommunityIcons
              name={meta.icon}
              size={tokens.iconSize.xxl}
              color={meta.color}
              style={{
                position: 'absolute',
                top: tokens.spacing.md,
                right: tokens.spacing.md,
                opacity: 0.16,
              }}
            />
            <View style={{ gap: tokens.spacing.xxs, paddingRight: tokens.spacing.xl }}>
              {title ? (
                <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
                  {title}
                </Text>
              ) : null}
              <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
                {message}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: tokens.spacing.sm,
              }}
            >
              {cancelLabel ? (
                <Button mode="text" onPress={onCancel}>
                  {cancelLabel}
                </Button>
              ) : null}
              <Button
                mode="contained"
                buttonColor={destructive ? tokens.colors.error : undefined}
                onPress={onConfirm}
              >
                {confirmLabel}
              </Button>
            </View>
          </View>
        </Card>
      </Animated.View>
    </View>
  );
}
