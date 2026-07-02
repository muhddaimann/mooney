import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type HeaderProps = {
  title: string;
  subtitle?: string;
  /** Shows a back button on the left, wired to `router.back()`. */
  showBack?: boolean;
  /** Custom content on the right - an action button, a menu, etc. */
  right?: ReactNode;
};

/**
 * Shared screen header: back button (left), title/subtitle, and a free-form
 * right slot. Every module's index/detail screen should use this instead of
 * hand-rolling its own header row.
 */
export function Header({ title, subtitle, showBack, right }: HeaderProps) {
  const { tokens } = useAppTheme();
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
      {showBack ? (
        <IconButton
          icon="chevron-left"
          mode="contained"
          size={tokens.iconSize.sm}
          containerColor={tokens.colors.primary}
          iconColor={tokens.colors.onPrimary}
          onPress={() => router.back()}
          style={{ margin: 0 }}
          accessibilityLabel="Back"
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text variant="headlineMedium" style={{ color: tokens.colors.text }}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodyMedium"
            style={{ color: tokens.colors.textSecondary, marginTop: tokens.spacing.xxs }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
