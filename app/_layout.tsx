import {
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
  SourceSansPro_700Bold,
  useFonts,
} from '@expo-google-fonts/source-sans-pro';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/constants/silenceWarnings';
import { AuthProvider } from '@/contexts/authContext';
import { KutuProvider } from '@/contexts/kutuContext';
import { LocalProvider } from '@/contexts/localContext';
import { OverlayProvider } from '@/contexts/overlayContext';
import { ThemeProvider, useTheme } from '@/contexts/themeContext';
import { useAuthGate } from '@/hooks/useAuth';

/** Matches the `@media (max-width: 480px)` breakpoint in public/index.html. */
const MOBILE_WIDTH_BREAKPOINT = 480;

/**
 * Keeps the document `<body>`, the desktop-preview fake status bar/home
 * indicator, and the `theme-color` meta tag in sync with the active theme.
 * Plain DOM mutation only, no expo-router/head involved.
 *
 * On desktop-wide viewports the body (the letterboxing around the phone-frame
 * preview) uses `surfaceVariant` so the "page" reads as distinct from the
 * "phone"; on real mobile widths there's no card, so body uses `background`
 * directly, same as the app content.
 */
function WebThemeSync() {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const isMobileWidth = width <= MOBILE_WIDTH_BREAKPOINT;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const background = tokens.colors.background;
    const bodyColor = isMobileWidth ? background : tokens.colors.surfaceVariant;

    document.body.style.backgroundColor = bodyColor;

    const statusBar = document.getElementById('mooney-fake-statusbar');
    if (statusBar) statusBar.style.backgroundColor = background;
    const homeIndicator = document.getElementById('mooney-fake-home-indicator');
    if (homeIndicator) homeIndicator.style.backgroundColor = background;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', background);
  }, [tokens.colors.background, tokens.colors.surfaceVariant, isMobileWidth]);

  return null;
}

/** Runs the auth gate once per app open. Rendered inside `OverlayProvider`/`AuthProvider` so it can use both. */
function AuthGate() {
  useAuthGate();
  return null;
}

/**
 * Root container behind every screen. Its background fills the full safe
 * area (including the top/bottom insets individual screens pad away from),
 * so the strip behind the notch/status bar and the home indicator always
 * matches the active theme instead of relying on transparency fall-through.
 */
function AppShell() {
  const { tokens } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <OverlayProvider>
        <WebThemeSync />
        <AuthGate />
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </OverlayProvider>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (navigator.storage?.persist) {
      navigator.storage.persist();
    }

    if (!('serviceWorker' in navigator)) return;

    if (__DEV__) {
      // The dev bundle URL never changes between reloads, so the SW's
      // cache-first rule would serve a stale copy of it forever. Only
      // install the SW in production, and clean up any that got registered
      // before this guard existed.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }, []);

  if (error) console.warn('Font loading error:', error);
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <LocalProvider>
        <AuthProvider>
          <KutuProvider>
            <ThemeProvider>
              <AppShell />
            </ThemeProvider>
          </KutuProvider>
        </AuthProvider>
      </LocalProvider>
    </SafeAreaProvider>
  );
}
