import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import { Text } from 'react-native-paper';

import { usePresenceAnim } from '@/components/overlay/usePresenceAnim';
import { variantMeta } from '@/components/overlay/variantMeta';
import { type ToastVariant } from '@/contexts/overlayTypes';
import { useAppTheme } from '@/hooks/useAppTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type OverlayToastProps = {
  variant: ToastVariant;
  message: string;
  /** Drives the slide-in/out transition; false animates out. */
  visible: boolean;
  onDismiss: () => void;
  /** Called once the exit transition settles, so the owner can unmount. */
  onExited: () => void;
};

/** Single toast: leading status icon + message. Tap anywhere to dismiss. */
export function OverlayToast({
  variant,
  message,
  visible,
  onDismiss,
  onExited,
}: OverlayToastProps) {
  const { tokens } = useAppTheme();
  const meta = variantMeta(tokens, variant);
  const progress = usePresenceAnim(visible, onExited, tokens.duration.normal);
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <AnimatedPressable
      onPress={onDismiss}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        minWidth: 260,
        maxWidth: 420,
        opacity: progress,
        transform: [{ translateX }],
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.colors.surface,
        borderWidth: tokens.borderWidth.thin,
        borderColor: tokens.colors.border,
        borderLeftWidth: tokens.borderWidth.heavy,
        borderLeftColor: meta.color,
        ...tokens.shadow.lg,
      }}
    >
      <MaterialCommunityIcons
        name={meta.icon}
        size={tokens.iconSize.md}
        color={meta.color}
      />
      <Text variant="bodyMedium" style={{ flex: 1, color: tokens.colors.text }}>
        {message}
      </Text>
    </AnimatedPressable>
  );
}
