/**
 * Mooney Design System
 * ---------------------
 * Single source of truth for every design constant in the app.
 *
 * - Color is theme-aware: `palettes.light` / `palettes.dark` share an identical
 *   shape so any consumer can switch themes without code changes.
 * - Everything else (spacing, radii, dimensions, typography, motion, etc.) is
 *   theme-agnostic and shared across both themes.
 *
 * Use `createTokens(mode)` to get a flattened, theme-resolved token object, or
 * consume the `useDesign()` hook which does this for you.
 */

export type ThemeMode = 'light' | 'dark';

/* -------------------------------------------------------------------------- */
/*  Color palettes                                                            */
/* -------------------------------------------------------------------------- */

export type Palette = {
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  borderStrong: string;
  overlay: string;
  error: string;
  success: string;
  warning: string;
  info: string;
};

const dark: Palette = {
  primary: '#6366f1', // Indigo 500
  primaryContainer: '#312e81', // Indigo 900
  onPrimary: '#f8fafc',
  secondary: '#10b981', // Emerald 500
  secondaryContainer: '#064e3b', // Emerald 900
  onSecondary: '#f8fafc',
  background: '#0f172a', // Slate 900
  surface: '#1e293b', // Slate 800
  surfaceVariant: '#273449',
  surfaceHover: '#334155', // Slate 700
  text: '#f8fafc', // Slate 50
  textSecondary: '#94a3b8', // Slate 400
  textDisabled: '#475569', // Slate 600
  border: '#334155', // Slate 700
  borderStrong: '#475569', // Slate 600
  overlay: 'rgba(15, 23, 42, 0.72)',
  error: '#ef4444', // Red 500
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  info: '#38bdf8', // Sky 400
};

const light: Palette = {
  primary: '#6366f1', // Indigo 500
  primaryContainer: '#e0e7ff', // Indigo 100
  onPrimary: '#ffffff',
  secondary: '#059669', // Emerald 600
  secondaryContainer: '#d1fae5', // Emerald 100
  onSecondary: '#ffffff',
  background: '#f8fafc', // Slate 50
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9', // Slate 100
  surfaceHover: '#e2e8f0', // Slate 200
  text: '#0f172a', // Slate 900
  textSecondary: '#475569', // Slate 600
  textDisabled: '#94a3b8', // Slate 400
  border: '#e2e8f0', // Slate 200
  borderStrong: '#cbd5e1', // Slate 300
  overlay: 'rgba(15, 23, 42, 0.45)',
  error: '#dc2626', // Red 600
  success: '#059669', // Emerald 600
  warning: '#d97706', // Amber 600
  info: '#0284c7', // Sky 600
};

export const palettes: Record<ThemeMode, Palette> = { light, dark };

/* -------------------------------------------------------------------------- */
/*  Spacing — 4pt baseline grid                                               */
/* -------------------------------------------------------------------------- */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/* -------------------------------------------------------------------------- */
/*  Border radii                                                              */
/* -------------------------------------------------------------------------- */

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
  round: 9999,
} as const;

/* -------------------------------------------------------------------------- */
/*  Border widths                                                            */
/* -------------------------------------------------------------------------- */

export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  thick: 2,
  heavy: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*  Fixed component dimensions                                               */
/* -------------------------------------------------------------------------- */

export const dimensions = {
  // Layout
  headerHeight: 56,
  tabBarHeight: 64,
  sidebarWidth: 280,
  sidebarCollapsedWidth: 72,
  maxContentWidth: 1100,
  // Controls
  buttonHeight: 48,
  buttonHeightSm: 36,
  buttonHeightLg: 56,
  inputHeight: 48,
  iconButton: 40,
  fabSize: 56,
  // Media
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,
  cardMaxWidth: 400,
  touchTarget: 44, // minimum accessible tap area
} as const;

/* -------------------------------------------------------------------------- */
/*  Icon sizes                                                               */
/* -------------------------------------------------------------------------- */

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/* -------------------------------------------------------------------------- */
/*  Typography                                                               */
/* -------------------------------------------------------------------------- */

export const fonts = {
  regular: 'SourceSansPro_400Regular',
  semibold: 'SourceSansPro_600SemiBold',
  bold: 'SourceSansPro_700Bold',
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  display: 56,
} as const;

export const fontWeight = {
  regular: '400',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

/* -------------------------------------------------------------------------- */
/*  Elevation / shadows — per-theme so they read correctly on any surface     */
/* -------------------------------------------------------------------------- */

export type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

const makeShadows = (color: string, opacityScale: number): Record<'none' | 'sm' | 'md' | 'lg' | 'xl', Shadow> => ({
  none: { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  sm: { shadowColor: color, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12 * opacityScale, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.16 * opacityScale, shadowRadius: 6, elevation: 3 },
  lg: { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2 * opacityScale, shadowRadius: 12, elevation: 6 },
  xl: { shadowColor: color, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28 * opacityScale, shadowRadius: 24, elevation: 12 },
});

export const shadows: Record<ThemeMode, Record<'none' | 'sm' | 'md' | 'lg' | 'xl', Shadow>> = {
  // Darker, more diffuse shadows read better on dark surfaces.
  dark: makeShadows('#000000', 1.6),
  light: makeShadows('#0f172a', 1),
};

/* -------------------------------------------------------------------------- */
/*  Opacity, motion, layering, responsive breakpoints                         */
/* -------------------------------------------------------------------------- */

export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  hover: 0.08,
  pressed: 0.12,
  backdrop: 0.5,
  full: 1,
} as const;

export const duration = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/* -------------------------------------------------------------------------- */
/*  Token resolver                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Build a flat, theme-resolved token object for the given mode. The returned
 * shape stays stable across themes — only `colors` and `shadow` change.
 */
export const createTokens = (mode: ThemeMode) => ({
  mode,
  colors: palettes[mode],
  shadow: shadows[mode],
  spacing,
  radii,
  borderWidth,
  dimensions,
  iconSize,
  fonts,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  opacity,
  duration,
  zIndex,
  breakpoints,
});

export type Tokens = ReturnType<typeof createTokens>;

/** Default token set (dark) — kept for non-reactive / module-scope usage. */
export const tokens = createTokens('dark');
