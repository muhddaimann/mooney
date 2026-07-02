import { useTheme } from "@/contexts/themeContext";

/**
 * Access the active design tokens and global styles inside a component.
 * Thin wrapper over the theme context for the conventional hooks/ location.
 *
 * @example
 * const { tokens, styles } = useAppTheme();
 * <View style={styles.screen}><Text style={{ color: tokens.colors.text }} /></View>
 */
export function useAppTheme() {
  const { tokens, styles, mode } = useTheme();
  return { tokens, styles, mode };
}
