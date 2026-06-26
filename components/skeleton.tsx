import React, { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type ViewStyle } from 'react-native';
import { useDesign } from '../contexts/designContext';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  /** Override the corner radius; ignored when `circle` is set. */
  radius?: number;
  /** Render as a circle (uses `height` for both dimensions). */
  circle?: boolean;
  style?: ViewStyle;
};

/**
 * Inline content placeholder with a soft pulse. Render it *in place of* content
 * while it loads for the first time — not as a blocking overlay. For refreshing
 * existing content, prefer a small inline spinner and keep the stale content.
 */
export function Skeleton({ width = '100%', height = 16, radius, circle, style }: SkeletonProps) {
  const { colors, radii, duration } = useDesign();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: duration.slow, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: duration.slow, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, duration.slow]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: circle ? height : width,
          height,
          borderRadius: circle ? height / 2 : radius ?? radii.sm,
          backgroundColor: colors.surfaceHover,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

type SkeletonTextProps = {
  /** Number of lines. */
  lines?: number;
  spacing?: number;
  lineHeight?: number;
  /** Width of the last line (often shorter), e.g. '60%'. */
  lastLineWidth?: DimensionValue;
};

/** A stack of line placeholders for paragraphs / list rows. */
export function SkeletonText({ lines = 3, spacing, lineHeight = 14, lastLineWidth = '60%' }: SkeletonTextProps) {
  const { spacing: tokens } = useDesign();
  const gap = spacing ?? tokens.xs;
  return (
    <>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          style={{ marginTop: i === 0 ? 0 : gap }}
        />
      ))}
    </>
  );
}
