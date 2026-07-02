import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

export const EMOJI_OPTIONS = ['🦄', '🐼', '🦊', '🐸', '🐧', '🦁', '🐨', '🐙'];

type EmojiPickerProps = {
  value: string;
  onChange: (emoji: string) => void;
};

/** Shared avatar-emoji grid, used anywhere a person/entity needs a quick icon (WhoAmI, kutu members). */
export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
      {EMOJI_OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: tokens.radii.md,
              borderWidth: tokens.borderWidth.thin,
              borderColor: selected ? tokens.colors.primary : tokens.colors.border,
              backgroundColor: selected
                ? tokens.colors.primaryContainer
                : tokens.colors.surfaceVariant,
            }}
          >
            <Text style={{ fontSize: tokens.fontSize.lg }}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
