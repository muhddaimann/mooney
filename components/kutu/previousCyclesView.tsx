import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { NoData } from '@/components/shared/noData';
import { getMonthLabelForRound, getRecipientForRound, type KutuGroup } from '@/hooks/useKutu';
import { useAppTheme } from '@/hooks/useAppTheme';

/** Rendered inside `overlay.modal` by the group detail screen's action menu. */
export function PreviousCyclesView({ group }: { group: KutuGroup }) {
  const { tokens } = useAppTheme();
  const completedRounds = Array.from({ length: group.currentRound - 1 }, (_, i) => i + 1);

  if (completedRounds.length === 0) {
    return (
      <NoData
        icon="history"
        title="No previous cycles yet"
        description="Completed rounds will show up here once everyone has paid."
      />
    );
  }

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        Previous cycles
      </Text>
      <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ gap: tokens.spacing.sm }}>
        {completedRounds.map((round) => {
          const recipient = getRecipientForRound(group, round);
          const roundContributions = group.contributions.filter((entry) => entry.round === round);

          return (
            <Card key={round}>
              <Card.Title
                title={getMonthLabelForRound(group, round)}
                subtitle={recipient ? `Payout to ${recipient.emoji} ${recipient.name}` : undefined}
              />
              <Card.Content style={{ gap: tokens.spacing.xs }}>
                {roundContributions.map((entry) => {
                  const member = group.members.find((candidate) => candidate.id === entry.memberId);
                  return (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text variant="bodyMedium" style={{ color: tokens.colors.text }}>
                        {member?.emoji} {member?.name ?? 'Unknown member'}
                      </Text>
                      <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
                        {entry.amount}
                      </Text>
                    </View>
                  );
                })}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
