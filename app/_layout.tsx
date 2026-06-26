import { Slot } from 'expo-router';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { View, LogBox } from 'react-native';
import { ThemeProvider } from '../contexts/ThemeContext';
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
]);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </ThemeProvider>
  );
}
