import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { getCurrentRecipient, getMonthLabelForRound, type KutuGroup } from '@/hooks/useKutu';
import { useAppTheme } from '@/hooks/useAppTheme';

/** List row for a single kutu group: name, membership progress, cycle, and next recipient. */
export function GroupCard({ group }: { group: KutuGroup }) {
  const { tokens } = useAppTheme();
  const recipient = getCurrentRecipient(group);
  const completedRounds = group.currentRound - 1;

  return (
    <Card>
      <Card.Content style={{ gap: tokens.spacing.xxs }}>
        <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
          {group.name}
        </Text>
        <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
          {group.members.length}/{group.totalMembers} joined · Cycle {completedRounds}/
          {group.totalMembers} · {group.contributionAmount} per round
        </Text>
        {recipient ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.xs }}>
            <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
              {getMonthLabelForRound(group, group.currentRound)} payout:
            </Text>
            <Text variant="bodySmall" style={{ color: tokens.colors.text }}>
              {recipient.emoji} {recipient.name}
            </Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
}
