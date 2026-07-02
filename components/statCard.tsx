import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type StatCardProps = {
  label: string;
  value: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
};

/**
 * Compact metric tile (e.g. "12 Projects") built from surface + border + shadow
 * tokens.
 */
export function StatCard({ label, value, icon }: StatCardProps) {
  const { tokens } = useAppTheme();

  return (
    <View
      style={{
        minWidth: 132,
        padding: tokens.spacing.md,
        gap: tokens.spacing.xs,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.colors.surface,
        borderWidth: tokens.borderWidth.thin,
        borderColor: tokens.colors.border,
        ...tokens.shadow.sm,
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={tokens.iconSize.lg}
        color={tokens.colors.primary}
      />
      <Text variant="headlineSmall" style={{ color: tokens.colors.text }}>
        {value}
      </Text>
      <Text variant="labelMedium" style={{ color: tokens.colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}
