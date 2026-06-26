import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDesign } from '../contexts/designContext';
import { useOverlay } from '../contexts/overlayContext';

const PANEL_WIDTH = 380;

/**
 * Right-side detail panel ("window"). Unlike the modal, this lives in the
 * layout flow and animates its width — so opening it pushes the page content
 * to the left rather than covering it. Mount it as the last sibling of the
 * content area.
 */
export default function WindowPanel() {
  const { colors, spacing, radii, fonts, fontSize, shadow, duration, iconSize } = useDesign();
  const { windowOpen, windowContent, windowTitle, closeWindow } = useOverlay();

  const anim = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  useEffect(() => {
    Animated.timing(anim, {
      toValue: windowOpen ? 1 : 0,
      duration: duration.normal,
      useNativeDriver: false, // width can't run on the native driver
    }).start();
  }, [windowOpen, anim, duration.normal]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: [0, PANEL_WIDTH] });

  return (
    <Animated.View style={{ width, overflow: 'hidden' }}>
      {/* Fixed-width inner keeps content from reflowing during the slide. */}
      <View
        style={{
          width: PANEL_WIDTH,
          flex: 1,
          backgroundColor: colors.surface,
          borderLeftWidth: 1,
          borderLeftColor: colors.border,
          ...shadow.lg,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            paddingLeft: spacing.lg,
            paddingRight: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text numberOfLines={1} style={{ flex: 1, color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg }}>
            {windowTitle ?? 'Details'}
          </Text>
          <Pressable
            onPress={closeWindow}
            accessibilityRole="button"
            accessibilityLabel="Close panel"
            hitSlop={spacing.sm}
            style={{
              width: 40,
              height: 40,
              borderRadius: radii.pill,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons name="close" size={iconSize.lg} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Body */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
          {windowContent}
        </ScrollView>
      </View>
    </Animated.View>
  );
}
