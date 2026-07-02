import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { about, type ChangelogEntry } from '@/constants/about';
import { useAppTheme } from '@/hooks/useAppTheme';

function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  const { tokens } = useAppTheme();
  return (
    <Card>
      <Card.Title title={`v${entry.version}`} subtitle={entry.date} />
      <Card.Content style={{ gap: tokens.spacing.xs }}>
        {entry.changes.map((change) => (
          <View key={change} style={{ flexDirection: 'row', gap: tokens.spacing.xs }}>
            <Text style={{ color: tokens.colors.textSecondary }}>•</Text>
            <Text
              variant="bodyMedium"
              style={{ color: tokens.colors.textSecondary, flexShrink: 1 }}
            >
              {change}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

/** Dashboard section showing just the latest release from `about.changelog`. */
export function ChangelogSection() {
  const { tokens } = useAppTheme();
  const latest = about.changelog[0];
  if (!latest) return null;

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        What's new
      </Text>
      <ChangelogCard entry={latest} />
    </View>
  );
}
