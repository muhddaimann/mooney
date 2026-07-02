import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type NoDataProps = {
  icon?: IconName;
  title: string;
  description?: string;
};

/** Shared empty state - no groups, no members, no transactions, etc. */
export function NoData({ icon = 'inbox-outline', title, description }: NoDataProps) {
  const { tokens } = useAppTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        gap: tokens.spacing.xs,
        paddingVertical: tokens.spacing.xl,
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <MaterialCommunityIcons name={icon} size={tokens.iconSize.xxl} color={tokens.colors.textSecondary} />
      <Text variant="titleMedium" style={{ color: tokens.colors.text, textAlign: 'center' }}>
        {title}
      </Text>
      {description ? (
        <Text
          variant="bodyMedium"
          style={{ color: tokens.colors.textSecondary, textAlign: 'center' }}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}
