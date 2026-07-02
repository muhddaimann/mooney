import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { EMOJI_OPTIONS, EmojiPicker } from '@/components/shared/emojiPicker';
import { about } from '@/constants/about';
import { type WhoAmI } from '@/contexts/authContext';
import { useAppTheme } from '@/hooks/useAppTheme';

type WhoAmIFormProps = {
  /** Called with the nickname/emoji; theme is attached separately by `useNewUser`. */
  onSubmit: (profile: Omit<WhoAmI, 'theme'>) => void;
  /** Pre-fills the form, e.g. when editing an existing profile. */
  initial?: WhoAmI;
};

/**
 * WhoAmI setup form: nickname + emoji avatar, nothing else. Rendered inside
 * an overlay modal with no modal chrome/title of its own - the intro copy
 * (what the app is, what it needs from you) lives here instead. Calls
 * `onSubmit` with the chosen name/emoji. Theme lives on the profile too, but
 * it's set via `ProfileMenu`'s "Toggle theme" item, not asked here.
 */
export function WhoAmIForm({ onSubmit, initial }: WhoAmIFormProps) {
  const { tokens } = useAppTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? EMOJI_OPTIONS[0]);

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View style={{ gap: tokens.spacing.xxs }}>
        <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
          {initial ? 'Edit your profile' : `Welcome to ${about.brand}`}
        </Text>
        <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
          {initial ? about.tagline : about.description}
        </Text>
      </View>

      <Text variant="bodyMedium" style={{ color: tokens.colors.text }}>
        {initial
          ? 'Update your nickname and avatar below.'
          : 'You just need a name and an icon to get started - no account, nothing leaves this device.'}
      </Text>

      <TextInput mode="outlined" label="Nickname" value={name} onChangeText={setName} />

      <EmojiPicker value={emoji} onChange={setEmoji} />

      <Button
        mode="contained"
        disabled={!name.trim()}
        onPress={() => onSubmit({ name: name.trim(), emoji })}
      >
        {initial ? 'Save' : 'Continue'}
      </Button>
    </View>
  );
}
