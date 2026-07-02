import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/card';
import { financeModules, type FinanceModule, type ModuleStatus } from '@/constants/modules';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOverlay } from '@/hooks/useOverlay';

const STATUS_LABEL: Record<ModuleStatus, string> = {
  planning: 'Planning',
  'in-progress': 'In progress',
  done: 'Ready',
};

function StatusPill({ status }: { status: ModuleStatus }) {
  const { tokens } = useAppTheme();
  return (
    <View
      style={{
        paddingVertical: tokens.spacing.xxs,
        paddingHorizontal: tokens.spacing.sm,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.colors.surfaceVariant,
      }}
    >
      <Text variant="labelSmall" style={{ color: tokens.colors.textSecondary }}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

function ModuleRow({ module }: { module: FinanceModule }) {
  const { tokens } = useAppTheme();
  const overlay = useOverlay();

  const content = (
    <Card>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.md }}>
        <MaterialCommunityIcons
          name={module.icon}
          size={tokens.iconSize.lg}
          color={tokens.colors.primary}
        />
        <View style={{ flex: 1, gap: tokens.spacing.xxs }}>
          <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
            {module.name}
          </Text>
          <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
            {module.goal}
          </Text>
        </View>
        <StatusPill status={module.status} />
      </Card.Content>
    </Card>
  );

  if (module.route) {
    return (
      <Link href={module.route} asChild>
        <Pressable>{content}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      onPress={() => overlay.toast({ variant: 'info', message: `${module.name} is coming soon.` })}
    >
      {content}
    </Pressable>
  );
}

/** Dashboard section listing the four Finance modules from `constants/modules.ts`. */
export function FinanceModulesSection() {
  const { tokens } = useAppTheme();
  return (
    <View style={{ gap: tokens.spacing.md }}>
      <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
        Modules
      </Text>
      <View style={{ gap: tokens.spacing.sm }}>
        {financeModules.map((module) => (
          <ModuleRow key={module.key} module={module} />
        ))}
      </View>
    </View>
  );
}
