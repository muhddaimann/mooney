import { Slot } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { View, LogBox, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DesignProvider } from '../contexts/designContext';
import { AuthProvider } from '../contexts/authContext';
import { OverlayProvider } from '../contexts/overlayContext';
import { palettes } from '../constants/design';
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
  SourceSansPro_700Bold,
} from "@expo-google-fonts/source-sans-pro";

// Ignore React Native Web deprecation warnings
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated',
  // Paper's ripple/icon animations fall back to JS when RCTAnimation isn't
  // present (e.g. web); harmless but noisy.
  'Animated: `useNativeDriver`',
]);

export default function RootLayout() {
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
  });

  if (!fontsLoaded) {
    const splash = palettes[scheme === 'dark' ? 'dark' : 'light'];
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: splash.background }}>
        <ActivityIndicator size="large" color={splash.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DesignProvider>
        <AuthProvider>
          <OverlayProvider>
            <Slot />
          </OverlayProvider>
        </AuthProvider>
      </DesignProvider>
    </SafeAreaProvider>
  );
}
