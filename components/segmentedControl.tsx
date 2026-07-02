import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentOption<T>[];
};

/**
 * Token-driven segmented control — a stand-in for Paper's SegmentedButtons.
 * The active segment uses the primary container / primary color pair.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
}: SegmentedControlProps<T>) {
  const { tokens } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        padding: tokens.borderWidth.thin,
        borderRadius: tokens.radii.pill,
        borderWidth: tokens.borderWidth.thin,
        borderColor: tokens.colors.border,
        backgroundColor: tokens.colors.surfaceVariant,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const color = selected ? tokens.colors.primary : tokens.colors.textSecondary;

        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: tokens.spacing.xs,
              paddingVertical: tokens.spacing.xs,
              paddingHorizontal: tokens.spacing.md,
              borderRadius: tokens.radii.pill,
              backgroundColor: selected
                ? tokens.colors.primaryContainer
                : 'transparent',
            }}
          >
            {option.icon ? (
              <MaterialCommunityIcons
                name={option.icon}
                size={tokens.iconSize.sm}
                color={color}
              />
            ) : null}
            <Text variant="labelLarge" style={{ color }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
