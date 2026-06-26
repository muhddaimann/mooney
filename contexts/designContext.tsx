import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createTokens, type ThemeMode, type Tokens } from '../constants/design';
import { StorageKeys, getItem, setItem } from './tokenContext';

/** Persisted preference. `'system'` means "follow the OS appearance". */
export type ThemePreference = ThemeMode | 'system';

type DesignContextValue = Tokens & {
  /** Active, resolved theme mode. */
  mode: ThemeMode;
  /** The stored preference (may be `'system'`). */
  preference: ThemePreference;
  /** Whether the active mode is following the OS appearance. */
  isSystem: boolean;
  /** Whether the persisted preference has been read from storage yet. */
  isHydrated: boolean;
  /** Flip between light and dark (pins the preference, stops following system). */
  toggleTheme: () => void;
  /** Pin a specific mode (stops following the system). */
  setMode: (mode: ThemeMode) => void;
  /** Hand control back to the OS appearance setting. */
  useSystemTheme: () => void;
};

const DesignContext = createContext<DesignContextValue | null>(null);

/**
 * Paper expects an icon library to be wired in. Its default icon names are
 * MaterialCommunityIcons names (e.g. `weather-night`), so we map straight onto
 * the Expo vector-icons font — no extra native linking required.
 */
const paperSettings = {
  icon: (props: React.ComponentProps<typeof MaterialCommunityIcons>) => (
    <MaterialCommunityIcons {...props} />
  ),
};

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

const resolveMode = (
  preference: ThemePreference,
  systemScheme: ReturnType<typeof useColorScheme>,
): ThemeMode => {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
};

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate the persisted preference once on mount.
  useEffect(() => {
    let active = true;
    getItem<ThemePreference>(StorageKeys.themePreference, 'system').then((stored) => {
      if (active) {
        setPreference(stored);
        setIsHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist whenever the user changes the preference (skip the initial hydrate).
  useEffect(() => {
    if (isHydrated) {
      setItem(StorageKeys.themePreference, preference);
    }
  }, [preference, isHydrated]);

  const mode = resolveMode(preference, systemScheme);

  const toggleTheme = useCallback(() => {
    setPreference(resolveMode(preference, systemScheme) === 'dark' ? 'light' : 'dark');
  }, [preference, systemScheme]);

  const setMode = useCallback((next: ThemeMode) => setPreference(next), []);
  const useSystemTheme = useCallback(() => setPreference('system'), []);

  const value = useMemo<DesignContextValue>(() => {
    const tokens = createTokens(mode);
    return {
      ...tokens,
      mode,
      preference,
      isSystem: preference === 'system',
      isHydrated,
      toggleTheme,
      setMode,
      useSystemTheme,
    };
  }, [mode, preference, isHydrated, toggleTheme, setMode, useSystemTheme]);

  const paperTheme = useMemo(() => buildPaperTheme(value), [value]);

  return (
    <DesignContext.Provider value={value}>
      <PaperProvider theme={paperTheme} settings={paperSettings}>
        {children}
      </PaperProvider>
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
  const { mode, preference, isSystem, isHydrated, toggleTheme, setMode, useSystemTheme } =
    useDesign();
  return { mode, preference, isSystem, isHydrated, toggleTheme, setMode, useSystemTheme };
};
