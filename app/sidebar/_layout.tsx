import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import Sidebar from '../../components/sidebar';
import { useDesign } from '../../contexts/designContext';

/**
 * Shell for the authenticated app: a persistent navigation sidebar alongside
 * the routed content area. Every `/sidebar/*` route renders inside here.
 */
export default function SidebarLayout() {
  const { colors } = useDesign();

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left']}
      style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}
    >
      <Sidebar />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}
