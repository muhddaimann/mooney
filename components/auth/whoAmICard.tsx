import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuth, useManageProfile } from '@/hooks/useAuth';

/**
 * Dashboard card for the WhoAmI local profile. Prompts a first-time setup
 * when no profile exists; just displays the nickname/avatar once one does -
 * edit/sign-out live in `ProfileMenu`, not duplicated here.
 */
export function WhoAmICard() {
  const { tokens } = useAppTheme();
  const { profile, hasProfile } = useAuth();
  const manageProfile = useManageProfile();

  if (!hasProfile || !profile) {
    return (
      <Card>
        <Card.Title title="WhoAmI" subtitle="No account needed - just a nickname and avatar" />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
            Set up a lightweight local profile to personalize this device.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => manageProfile()}>
            Set up profile
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: tokens.radii.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: tokens.colors.primaryContainer,
            }}
          >
            <Text style={{ fontSize: tokens.fontSize.xl }}>{profile.emoji}</Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
              {profile.name}
            </Text>
            <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
              Local profile on this device
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
