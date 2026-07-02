import { Animated, StyleSheet, type ViewStyle } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { usePresenceAnim } from '@/components/overlay/usePresenceAnim';
import { useAppTheme } from '@/hooks/useAppTheme';

/** `backdrop-filter` is a web-only style absent from RN's ViewStyle typings. */
const blur = (px: number): ViewStyle =>
  ({
    backdropFilter: `blur(${px}px)`,
    WebkitBackdropFilter: `blur(${px}px)`,
  }) as unknown as ViewStyle;

type LoaderOverlayProps = {
  message?: string;
};

/**
 * Full-screen blocking loader: a blurred, dimmed backdrop with a spinner and
 * optional message. Replaces the loading-toast pattern.
 */
export function LoaderOverlay({ message }: LoaderOverlayProps) {
  const { tokens, mode } = useAppTheme();
  const progress = usePresenceAnim(true, undefined, tokens.duration.normal);
  // The dim/blurred backdrop already darkens the scene, so light mode reads
  // best with the (light) background color; dark mode's background is
  // near-black like the backdrop itself, so it needs onBackground instead.
  const contentColor = mode === 'dark' ? tokens.colors.onBackground : tokens.colors.background;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        blur(6),
        {
          opacity: progress,
          backgroundColor: tokens.colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing.md,
          padding: tokens.spacing.lg,
        },
      ]}
    >
      <ActivityIndicator size="large" color={contentColor} />
      {message ? (
        <Text variant="titleMedium" style={{ color: contentColor, textAlign: 'center' }}>
          {message}
        </Text>
      ) : null}
    </Animated.View>
  );
}
