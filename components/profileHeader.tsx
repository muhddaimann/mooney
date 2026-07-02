import { View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type ProfileHeaderProps = {
  name: string;
  title: string;
  /** 1–2 character initials shown in the avatar. */
  initials: string;
};

/**
 * Portfolio hero block: avatar beside a name and role.
 */
export function ProfileHeader({ name, title, initials }: ProfileHeaderProps) {
  const { tokens } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
      <Avatar.Text size={tokens.dimensions.avatarLg} label={initials} />
      <View style={{ flexShrink: 1 }}>
        <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
