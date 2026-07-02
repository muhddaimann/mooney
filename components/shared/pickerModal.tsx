import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fragment, useState, type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type PickerOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: IconName;
  /** Secondary description shown under the label. */
  details?: string;
  /** Styles the row in the error color, for destructive actions. */
  destructive?: boolean;
  /** Renders a divider above this option. */
  divider?: boolean;
};

type PickerModalProps<T extends string> = {
  options: PickerOption<T>[];
  onSelect: (value: T) => void;
};

function PickerOptionRow<T extends string>({
  option,
  onSelect,
}: {
  option: PickerOption<T>;
  onSelect: (value: T) => void;
}) {
  const { tokens } = useAppTheme();
  const [hovered, setHovered] = useState(false);
  const textColor = option.destructive ? tokens.colors.error : tokens.colors.text;
  const iconColor = option.destructive
    ? tokens.colors.error
    : hovered
      ? tokens.colors.primary
      : tokens.colors.textSecondary;

  return (
    <Pressable
      onPress={() => onSelect(option.value)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        borderRadius: tokens.radii.md,
        backgroundColor: hovered ? tokens.colors.surfaceHover : 'transparent',
      }}
    >
      {option.icon ? (
        <MaterialCommunityIcons name={option.icon} size={tokens.iconSize.md} color={iconColor} />
      ) : null}
      <View style={{ flex: 1, gap: tokens.spacing.xxs }}>
        <Text variant="bodyMedium" style={{ color: textColor }}>
          {option.label}
        </Text>
        {option.details ? (
          <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
            {option.details}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Shared list-of-options picker, meant to be rendered inside `overlay.modal`
 * (typically `variant: 'bottom-sheet'`). This is the app-wide replacement
 * for a bespoke positioned dropdown - every "pick one of these actions"
 * menu should go through `overlay.modal` + this instead.
 *
 * @example
 * const action = await overlay.modal<'edit' | 'delete'>({
 *   variant: 'bottom-sheet',
 *   render: (close) => (
 *     <PickerModal
 *       options={[
 *         { value: 'edit', label: 'Edit', icon: 'pencil' },
 *         { value: 'delete', label: 'Delete', icon: 'trash-can', destructive: true, divider: true },
 *       ]}
 *       onSelect={close}
 *     />
 *   ),
 * });
 */
export function PickerModal<T extends string>({ options, onSelect }: PickerModalProps<T>) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ gap: tokens.spacing.xxs }}>
      {options.map((option) => (
        <Fragment key={option.value}>
          {option.divider ? (
            <View
              style={{
                height: tokens.borderWidth.thin,
                backgroundColor: tokens.colors.border,
                marginVertical: tokens.spacing.xs,
              }}
            />
          ) : null}
          <PickerOptionRow option={option} onSelect={onSelect} />
        </Fragment>
      ))}
    </View>
  );
}
