import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 28;
const PADDING = 3;
const KNOB = TRACK_HEIGHT - PADDING * 2;

/** `cursor` is a valid web style but absent from RN's ViewStyle typings. */
const pointer: ViewStyle = { cursor: 'pointer' } as unknown as ViewStyle;

/**
 * Token-driven pill-in-pill toggle — a reliable stand-in for Paper's Switch
 * (which renders inconsistently on web). The knob slides between ends with an
 * eased translate, and the track flips to the primary color when on.
 */
export function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  const { tokens } = useAppTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: tokens.duration.fast,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, anim, tokens.duration.fast]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - KNOB - PADDING * 2],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        {
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          padding: PADDING,
          justifyContent: 'center',
          borderRadius: tokens.radii.pill,
          backgroundColor: value
            ? tokens.colors.primary
            : tokens.colors.surfaceVariant,
          borderWidth: tokens.borderWidth.thin,
          borderColor: value ? tokens.colors.primary : tokens.colors.borderStrong,
          opacity: disabled ? tokens.opacity.disabled : tokens.opacity.full,
        },
        pointer,
      ]}
    >
      <Animated.View
        style={{
          width: KNOB,
          height: KNOB,
          borderRadius: tokens.radii.pill,
          backgroundColor: value
            ? tokens.colors.onPrimary
            : tokens.colors.textSecondary,
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  );
}
