import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, Slot } from 'expo-router';
import Sidebar from '../../components/sidebar';
import WindowPanel from '../../components/windowPanel';
import { useDesign } from '../../contexts/designContext';
import { useAuth } from '../../contexts/authContext';

/**
 * Shell for the authenticated app: a persistent navigation sidebar alongside
 * the routed content area. Every `/sidebar/*` route renders inside here and is
 * guarded — unauthenticated visitors are bounced to the login screen.
 */
export default function SidebarLayout() {
  const { colors } = useDesign();
  const { isAuthenticated, isHydrated } = useAuth();

  // Avoid a flash of app chrome before the persisted session loads.
  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left']}
      style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}
    >
      <Sidebar />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      {/* Right-side detail panel — pushes content left when open. */}
      <WindowPanel />
    </SafeAreaView>
  );
}
