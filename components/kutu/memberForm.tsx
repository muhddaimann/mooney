import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { EMOJI_OPTIONS, EmojiPicker } from '@/components/shared/emojiPicker';
import { useAppTheme } from '@/hooks/useAppTheme';

type MemberFormValues = {
  name: string;
  emoji: string;
};

type MemberFormProps = {
  onSubmit: (values: MemberFormValues) => void;
};

/** Add-member form: name + emoji avatar, nothing else. */
export function MemberForm({ onSubmit }: MemberFormProps) {
  const { tokens } = useAppTheme();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        Add member
      </Text>

      <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} />

      <EmojiPicker value={emoji} onChange={setEmoji} />

      <Button
        mode="contained"
        disabled={!name.trim()}
        onPress={() => onSubmit({ name: name.trim(), emoji })}
      >
        Add member
      </Button>
    </View>
  );
}
