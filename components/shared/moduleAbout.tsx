import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

export type ModuleAboutContent = {
  title: string;
  /** What the module is for. */
  goal: string;
  /** Numbered usage steps. */
  howTo: string[];
};

/** Rendered inside `overlay.modal` by `ModuleMenu`'s "About" action. */
export function ModuleAboutView({ content }: { content: ModuleAboutContent }) {
  const { tokens } = useAppTheme();
  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        {content.title}
      </Text>
      <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
        {content.goal}
      </Text>
      {content.howTo.length > 0 ? (
        <View style={{ gap: tokens.spacing.sm }}>
          <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
            How it works
          </Text>
          {content.howTo.map((step, index) => (
            <View key={step} style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
              <Text variant="bodyMedium" style={{ color: tokens.colors.primary }}>
                {index + 1}.
              </Text>
              <Text variant="bodyMedium" style={{ color: tokens.colors.text, flexShrink: 1 }}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
