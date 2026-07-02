import { Animated, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { usePresenceAnim } from '@/components/overlay/usePresenceAnim';
import { type ModalVariant } from '@/contexts/overlayTypes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type Tokens } from '@/constants/theme';
import { type ReactNode } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type OverlayModalProps = {
  variant: ModalVariant;
  title?: string;
  dismissable: boolean;
  /** Drives the enter/exit transition; false animates out. */
  visible: boolean;
  onDismiss: () => void;
  /** Called once the exit transition settles, so the owner can unmount. */
  onExited: () => void;
  children: ReactNode;
};

/** Positioning of the surface differs per variant; alignment of the backdrop. */
function containerAlignment(variant: ModalVariant): ViewStyle {
  switch (variant) {
    case 'bottom-sheet':
      return { justifyContent: 'flex-end', alignItems: 'stretch' };
    case 'fullscreen':
      return { justifyContent: 'center', alignItems: 'stretch' };
    default:
      return { justifyContent: 'center', alignItems: 'center' };
  }
}

function surfaceStyle(variant: ModalVariant, tokens: Tokens): ViewStyle {
  const base: ViewStyle = {
    backgroundColor: tokens.colors.surface,
    borderColor: tokens.colors.border,
    borderWidth: tokens.borderWidth.thin,
    ...tokens.shadow.xl,
  };

  switch (variant) {
    case 'fullscreen':
      return { ...base, flex: 1, borderWidth: 0, borderRadius: 0 };
    case 'bottom-sheet':
      return {
        ...base,
        width: '100%',
        maxHeight: '85%',
        borderBottomWidth: 0,
        borderTopLeftRadius: tokens.radii.xl,
        borderTopRightRadius: tokens.radii.xl,
      };
    case 'form':
      return {
        ...base,
        width: '100%',
        maxWidth: 520,
        maxHeight: '85%',
        borderRadius: tokens.radii.lg,
      };
    case 'standard':
    default:
      return {
        ...base,
        width: '100%',
        maxWidth: 480,
        borderRadius: tokens.radii.lg,
      };
  }
}

export function OverlayModal({
  variant,
  title,
  dismissable,
  visible,
  onDismiss,
  onExited,
  children,
}: OverlayModalProps) {
  const { tokens } = useAppTheme();
  const fullscreen = variant === 'fullscreen';
  const progress = usePresenceAnim(visible, onExited);

  // Bottom sheets slide up from the bottom edge; other variants scale in.
  const enterTransform =
    variant === 'bottom-sheet'
      ? [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }]
      : [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }];

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { padding: fullscreen ? 0 : tokens.spacing.lg },
        containerAlignment(variant),
      ]}
    >
      <AnimatedPressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: tokens.colors.overlay, opacity: progress },
        ]}
        onPress={dismissable ? onDismiss : undefined}
        disabled={!dismissable}
      />
      <Animated.View
        style={[
          surfaceStyle(variant, tokens),
          { opacity: progress, transform: enterTransform },
        ]}
      >
        {title ? (
          <View
            style={{
              paddingHorizontal: tokens.spacing.lg,
              paddingTop: tokens.spacing.md,
              paddingBottom: tokens.spacing.xs,
            }}
          >
            <Text
              variant="titleMedium"
              style={{ color: tokens.colors.text }}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        ) : null}
        <ScrollView
          contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}
          style={fullscreen ? { flex: 1 } : undefined}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
