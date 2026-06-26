import React from 'react';
import { IconButton } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  /** Override the icon button size (defaults to the design `iconButton` dimension). */
  size?: number;
};

/**
 * A single tap toggles between light and dark. Reflects the active mode with a
 * sun / moon icon and reads its colors from the design system.
 */
export default function ThemeToggle({ size }: Props) {
  const { mode, toggleTheme, colors, dimensions } = useDesign();
  const isDark = mode === 'dark';

  return (
    <IconButton
      icon={isDark ? 'weather-sunny' : 'weather-night'}
      size={size ?? dimensions.iconButton / 2}
      iconColor={colors.text}
      containerColor={colors.surfaceVariant}
      onPress={toggleTheme}
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    />
  );
}
