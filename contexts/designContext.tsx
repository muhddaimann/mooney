import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';
import { createTokens, type ThemeMode, type Tokens } from '../constants/design';

type DesignContextValue = Tokens & {
  /** Active theme mode. */
  mode: ThemeMode;
  /** Whether the active mode is following the OS appearance. */
  isSystem: boolean;
  /** Flip between light and dark (stops following the system). */
  toggleTheme: () => void;
  /** Pin a specific mode (stops following the system). */
  setMode: (mode: ThemeMode) => void;
  /** Hand control back to the OS appearance setting. */
  useSystemTheme: () => void;
};

const DesignContext = createContext<DesignContextValue | null>(null);

/** Map our tokens onto a Material Design 3 theme for react-native-paper. */
const buildPaperTheme = (tokens: Tokens): MD3Theme => {
  const base = tokens.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const { colors } = tokens;
  return {
    ...base,
    roundness: tokens.radii.md / 4, // Paper multiplies roundness by 4
    colors: {
      ...base.colors,
      primary: colors.primary,
      primaryContainer: colors.primaryContainer,
      onPrimary: colors.onPrimary,
      secondary: colors.secondary,
      secondaryContainer: colors.secondaryContainer,
      onSecondary: colors.onSecondary,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceVariant,
      onSurface: colors.text,
      onSurfaceVariant: colors.textSecondary,
      outline: colors.border,
      outlineVariant: colors.borderStrong,
      error: colors.error,
      backdrop: colors.overlay,
    },
  };
};

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  // `null` => follow the OS; otherwise a user-pinned override.
  const [override, setOverride] = useState<ThemeMode | null>(null);

  const mode: ThemeMode = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = useCallback(() => {
    setOverride((prev) => {
      const current = prev ?? (systemScheme === 'dark' ? 'dark' : 'light');
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const setMode = useCallback((next: ThemeMode) => setOverride(next), []);
  const useSystemTheme = useCallback(() => setOverride(null), []);

  const value = useMemo<DesignContextValue>(() => {
    const tokens = createTokens(mode);
    return {
      ...tokens,
      mode,
      isSystem: override === null,
      toggleTheme,
      setMode,
      useSystemTheme,
    };
  }, [mode, override, toggleTheme, setMode, useSystemTheme]);

  const paperTheme = useMemo(() => buildPaperTheme(value), [value]);

  return (
    <DesignContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </DesignContext.Provider>
  );
};

export const useDesign = (): DesignContextValue => {
  const ctx = useContext(DesignContext);
  if (!ctx) {
    throw new Error('useDesign must be used within a <DesignProvider>');
  }
  return ctx;
};

/** Convenience hook for just the theme controls. */
export const useTheme = () => {
  const { mode, isSystem, toggleTheme, setMode, useSystemTheme } = useDesign();
  return { mode, isSystem, toggleTheme, setMode, useSystemTheme };
};
