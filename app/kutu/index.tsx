import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupCard } from '@/components/kutu/groupCard';
import { ActionMenu } from '@/components/shared/actionMenu';
import { Header } from '@/components/shared/header';
import { ModuleAboutView } from '@/components/shared/moduleAbout';
import { NoData } from '@/components/shared/noData';
import { type PickerOption } from '@/components/shared/pickerModal';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOverlay } from '@/hooks/useOverlay';
import { useClearAllGroups, useCreateGroup, useKutu, useLoadSampleData } from '@/hooks/useKutu';

const ABOUT_KUTU = {
  title: 'Kutu Tracker',
  goal: 'Manage kutu (rotating savings) groups from start to payout. Each member contributes a fixed amount every round, and one member receives the pooled total in turn.',
  howTo: [
    'Create a group, set the contribution amount per round, and how many members will join.',
    'Add the members participating in the group.',
    "Record each member's contribution as they pay for the current round.",
    'Once everyone has paid, the round advances and the next member in line receives the payout.',
  ],
};

type KutuIndexAction = 'add' | 'seed' | 'about' | 'clear';

export default function KutuScreen() {
  const { styles, tokens } = useAppTheme();
  const { groups } = useKutu();
  const createGroup = useCreateGroup();
  const loadSampleData = useLoadSampleData();
  const clearAllGroups = useClearAllGroups();
  const overlay = useOverlay();
  const router = useRouter();

  const options: PickerOption<KutuIndexAction>[] = [
    { value: 'add', label: 'Add group', icon: 'plus' },
    { value: 'seed', label: 'Load sample data', icon: 'database-import-outline' },
    { value: 'about', label: 'About', icon: 'information-outline' },
    {
      value: 'clear',
      label: 'Clear all groups',
      icon: 'delete-outline',
      destructive: true,
      divider: true,
    },
  ];

  const handleSelect = async (action: KutuIndexAction) => {
    if (action === 'add') {
      const group = await createGroup();
      if (group) router.push(`/kutu/${group.id}`);
      return;
    }
    if (action === 'seed') {
      const group = await loadSampleData();
      router.push(`/kutu/${group.id}`);
      return;
    }
    if (action === 'about') {
      overlay.modal({ render: () => <ModuleAboutView content={ABOUT_KUTU} /> });
      return;
    }
    const confirmed = await overlay.confirm({
      title: 'Clear all groups?',
      message: 'This cannot be undone.',
      confirmLabel: 'Clear all groups',
      destructive: true,
    });
    if (confirmed) clearAllGroups();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: tokens.spacing.lg }}
      >
        <View style={{ gap: tokens.spacing.xl }}>
          <Header
            title="Kutu Tracker"
            subtitle="Manage kutu groups from start to payout."
            showBack
            right={<ActionMenu options={options} onSelect={handleSelect} />}
          />

          {groups.length === 0 ? (
            <NoData
              icon="account-group-outline"
              title="No groups yet"
              description="Create one to get started."
            />
          ) : (
            <View style={{ gap: tokens.spacing.sm }}>
              {groups.map((group) => (
                <Link key={group.id} href={`/kutu/${group.id}`} asChild>
                  <Pressable>
                    <GroupCard group={group} />
                  </Pressable>
                </Link>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
