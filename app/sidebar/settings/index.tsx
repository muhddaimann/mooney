import React from 'react';
import { View } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import { useDesign, useTheme, type ThemePreference } from '../../../contexts/designContext';

export default function Settings() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();
  const { preference, setMode, useSystemTheme } = useTheme();

  const onChange = (next: string) => {
    if (next === 'system') useSystemTheme();
    else setMode(next as Exclude<ThemePreference, 'system'>);
  };

  return (
    <View style={{ flex: 1, padding: spacing.lg }}>
      <Text
        style={{
          color: colors.text,
          fontFamily: fonts.bold,
          fontSize: fontSize.xxl,
          marginBottom: spacing.lg,
        }}
      >
        Settings
      </Text>

      <Card
        style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          ...shadow.md,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
            marginBottom: spacing.xs,
          }}
        >
          Appearance
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.md,
            marginBottom: spacing.md,
          }}
        >
          Choose a theme or follow your device setting. Your choice is saved.
        </Text>

        <SegmentedButtons
          value={preference}
          onValueChange={onChange}
          buttons={[
            { value: 'light', label: 'Light', icon: 'weather-sunny' },
            { value: 'dark', label: 'Dark', icon: 'weather-night' },
            { value: 'system', label: 'System', icon: 'cellphone' },
          ]}
        />
      </Card>
    </View>
  );
}
