import { StyleSheet } from "react-native";
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";

export type ThemeMode = "light" | "dark";

/* -------------------------------------------------------------------------- */
/*  Color palettes                                                            */
/* -------------------------------------------------------------------------- */

export type Palette = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  background: string;
  onBackground: string;

  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceHover: string;

  text: string;
  textSecondary: string;
  textDisabled: string;

  border: string;
  borderStrong: string;

  overlay: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  success: string;
  warning: string;
  info: string;
};

const dark: Palette = {
  primary: "#0891b2",
  onPrimary: "#ffffff",
  primaryContainer: "#164e63",
  onPrimaryContainer: "#cffafe",

  secondary: "#facc15",
  onSecondary: "#111827",
  secondaryContainer: "#713f12",
  onSecondaryContainer: "#fef9c3",

  tertiary: "#22c55e",
  onTertiary: "#ffffff",
  tertiaryContainer: "#14532d",
  onTertiaryContainer: "#dcfce7",

  background: "#020617",
  onBackground: "#f8fafc",

  surface: "#0f172a",
  onSurface: "#f8fafc",
  surfaceVariant: "#1e293b",
  onSurfaceVariant: "#cbd5e1",
  surfaceHover: "#334155",

  text: "#f8fafc",
  textSecondary: "#94a3b8",
  textDisabled: "#64748b",

  border: "#334155",
  borderStrong: "#475569",

  overlay: "rgba(2,6,23,0.72)",

  error: "#ef4444",
  onError: "#ffffff",
  errorContainer: "#7f1d1d",
  onErrorContainer: "#fecaca",

  success: "#22c55e",
  warning: "#f59e0b",
  info: "#38bdf8",
};

const light: Palette = {
  primary: "#0891b2",
  onPrimary: "#ffffff",
  primaryContainer: "#cffafe",
  onPrimaryContainer: "#164e63",

  secondary: "#eab308",
  onSecondary: "#111827",
  secondaryContainer: "#fef9c3",
  onSecondaryContainer: "#713f12",

  tertiary: "#16a34a",
  onTertiary: "#ffffff",
  tertiaryContainer: "#dcfce7",
  onTertiaryContainer: "#14532d",

  background: "#f8fafc",
  onBackground: "#0f172a",

  surface: "#ffffff",
  onSurface: "#0f172a",
  surfaceVariant: "#f1f5f9",
  onSurfaceVariant: "#475569",
  surfaceHover: "#e2e8f0",

  text: "#0f172a",
  textSecondary: "#475569",
  textDisabled: "#94a3b8",

  border: "#e2e8f0",
  borderStrong: "#cbd5e1",

  overlay: "rgba(15,23,42,0.45)",

  error: "#dc2626",
  onError: "#ffffff",
  errorContainer: "#fee2e2",
  onErrorContainer: "#7f1d1d",

  success: "#16a34a",
  warning: "#d97706",
  info: "#0284c7",
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
  regular: "SourceSansPro_400Regular",
  semibold: "SourceSansPro_600SemiBold",
  bold: "SourceSansPro_700Bold",
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
  regular: "400",
  semibold: "600",
  bold: "700",
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

const makeShadows = (
  color: string,
  opacityScale: number,
): Record<"none" | "sm" | "md" | "lg" | "xl", Shadow> => ({
  none: {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12 * opacityScale,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16 * opacityScale,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2 * opacityScale,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28 * opacityScale,
    shadowRadius: 24,
    elevation: 12,
  },
});

export const shadows: Record<
  ThemeMode,
  Record<"none" | "sm" | "md" | "lg" | "xl", Shadow>
> = {
  // Darker, more diffuse shadows read better on dark surfaces.
  dark: makeShadows("#000000", 1.6),
  light: makeShadows("#0f172a", 1),
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
export const tokens = createTokens("dark");

/* -------------------------------------------------------------------------- */
/*  React Native Paper theme                                                  */
/* -------------------------------------------------------------------------- */

/**
 * MD3's default typescale (headlineMedium 28, displaySmall 36, titleLarge
 * 22...) reads oversized for a compact PWA. Scale every variant down
 * uniformly rather than patching individual screens, so the hierarchy stays
 * intact but the whole app reads smaller.
 */
const FONT_SCALE = 0.85;

/**
 * Rewrite every MD3 typescale variant to use the Source Sans Pro face that
 * matches its weight, so Paper text renders in the app font with real
 * semibold/bold glyphs (not browser faux-bold), and scale the size down (see
 * `FONT_SCALE`). Fonts must be loaded first (see app/_layout.tsx).
 */
const withAppFonts = (typescale: MD3Theme["fonts"]): MD3Theme["fonts"] => {
  const familyFor = (weight?: string) => {
    const w = Number(weight ?? "400");
    if (w >= 700) return fonts.bold;
    if (w >= 600) return fonts.semibold;
    return fonts.regular;
  };

  const next = {} as Record<string, unknown>;
  for (const [variant, style] of Object.entries(typescale)) {
    if (!style || typeof style !== "object") {
      next[variant] = style;
      continue;
    }
    const s = style as { fontWeight?: string; fontSize?: number; lineHeight?: number };
    next[variant] = {
      ...s,
      fontFamily: familyFor(s.fontWeight),
      ...(typeof s.fontSize === "number"
        ? { fontSize: Math.round(s.fontSize * FONT_SCALE) }
        : {}),
      ...(typeof s.lineHeight === "number"
        ? { lineHeight: Math.round(s.lineHeight * FONT_SCALE) }
        : {}),
    };
  }
  return next as MD3Theme["fonts"];
};

/**
 * Build a Paper MD3 theme from our palette so Paper components (Button, Text,
 * Surface…) render with the same colors and font as the rest of the design
 * system.
 */
export const createPaperTheme = (mode: ThemeMode): MD3Theme => {
  const base = mode === "dark" ? MD3DarkTheme : MD3LightTheme;
  const c = palettes[mode];

  return {
    ...base,
    roundness: radii.md,
    fonts: withAppFonts(base.fonts),
    colors: {
      ...base.colors,
      primary: c.primary,
      primaryContainer: c.primaryContainer,
      onPrimary: c.onPrimary,
      onPrimaryContainer: c.text,
      secondary: c.secondary,
      secondaryContainer: c.secondaryContainer,
      onSecondary: c.onSecondary,
      onSecondaryContainer: c.text,
      background: c.background,
      onBackground: c.text,
      surface: c.surface,
      onSurface: c.text,
      surfaceVariant: c.surfaceVariant,
      onSurfaceVariant: c.textSecondary,
      surfaceDisabled: c.surfaceVariant,
      onSurfaceDisabled: c.textDisabled,
      outline: c.border,
      outlineVariant: c.borderStrong,
      error: c.error,
      errorContainer: c.errorContainer,
      backdrop: c.overlay,
    },
  };
};

/* -------------------------------------------------------------------------- */
/*  Global styles — token-driven so they track the active theme               */
/* -------------------------------------------------------------------------- */

/**
 * Reusable layout styles resolved against the active token set. Rebuilt per
 * theme so colors/spacing stay in sync. Consume via the theme context.
 */
export const createGlobalStyles = (t: Tokens) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    screen: {
      flex: 1,
      padding: t.spacing.md,
      backgroundColor: t.colors.background,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: t.spacing.lg,
      backgroundColor: t.colors.background,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: t.dimensions.cardMaxWidth,
      padding: t.spacing.lg,
      borderRadius: t.radii.lg,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidth.thin,
      borderColor: t.colors.border,
      ...t.shadow.md,
    },
    content: {
      width: "100%",
      maxWidth: t.dimensions.maxContentWidth,
      alignSelf: "center",
    },
  });

export type GlobalStyles = ReturnType<typeof createGlobalStyles>;
