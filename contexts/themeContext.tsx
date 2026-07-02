import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PaperProvider } from 'react-native-paper';

import {
  createGlobalStyles,
  createPaperTheme,
  createTokens,
  type GlobalStyles,
  type ThemeMode,
  type Tokens,
} from '@/constants/theme';

type ThemeContextValue = {
  /** Active theme mode. */
  mode: ThemeMode;
  /** Design tokens (colors, spacing, radii, typography…) for the active mode. */
  tokens: Tokens;
  /** Reusable layout styles resolved against the active tokens. */
  styles: GlobalStyles;
  /** Switch directly to a given mode. */
  setMode: (mode: ThemeMode) => void;
  /** Flip between light and dark. */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
};

export function ThemeProvider({
  children,
  initialMode = 'light',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const tokens = useMemo(() => createTokens(mode), [mode]);
  const styles = useMemo(() => createGlobalStyles(tokens), [tokens]);
  const paperTheme = useMemo(() => createPaperTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      tokens,
      styles,
      setMode,
      toggleTheme: () =>
        setMode((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [mode, tokens, styles],
  );

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

/** Full theme context: mode, tokens, styles, and mode controls. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** Convenience selector for just the mode controls. */
export function useThemeMode() {
  const { mode, setMode, toggleTheme } = useTheme();
  return { mode, setMode, toggleTheme };
}
