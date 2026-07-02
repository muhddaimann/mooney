import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { PreviousCyclesView } from '@/components/kutu/previousCyclesView';
import { ActionMenu } from '@/components/shared/actionMenu';
import { Header } from '@/components/shared/header';
import { NoData } from '@/components/shared/noData';
import { type PickerOption } from '@/components/shared/pickerModal';
import { getMonthLabelForRound, getPendingMembers, useAddMember, useKutu } from '@/hooks/useKutu';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOverlay } from '@/hooks/useOverlay';

type GroupAction = 'addMember' | 'contribute' | 'history';

export default function KutuGroupScreen() {
  const { styles, tokens } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { groups } = useKutu();
  const addMember = useAddMember();
  const overlay = useOverlay();
  const router = useRouter();

  const group = groups.find((entry) => entry.id === id);

  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: tokens.spacing.lg }}>
          <Header title="Group not found" showBack />
        </View>
      </SafeAreaView>
    );
  }

  const pending = getPendingMembers(group);

  const isFull = group.members.length >= group.totalMembers;

  const options: PickerOption<GroupAction>[] = [
    ...(isFull
      ? []
      : ([{ value: 'addMember', label: 'Add member', icon: 'account-plus-outline' }] as PickerOption<GroupAction>[])),
    ...(group.members.length > 0
      ? ([
          { value: 'contribute', label: 'Record contribution', icon: 'cash-plus' },
        ] as PickerOption<GroupAction>[])
      : []),
    { value: 'history', label: 'View previous cycles', icon: 'history' },
  ];

  const handleSelect = (action: GroupAction) => {
    if (action === 'addMember') {
      addMember(group.id);
    } else if (action === 'contribute') {
      router.push(`/kutu/add?groupId=${group.id}`);
    } else if (action === 'history') {
      overlay.modal({ render: () => <PreviousCyclesView group={group} /> });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: tokens.spacing.lg }}
      >
        <View style={{ gap: tokens.spacing.xl }}>
          <Header
            title={group.name}
            subtitle={`${group.contributionAmount} per round · ${getMonthLabelForRound(group, group.currentRound)} in progress`}
            showBack
            right={<ActionMenu options={options} onSelect={handleSelect} />}
          />

          <View style={{ gap: tokens.spacing.md }}>
            <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
              Members ({group.members.length}/{group.totalMembers})
            </Text>

            {group.members.length === 0 ? (
              <NoData
                icon="account-multiple-outline"
                title="No members yet"
                description="Add the people in this group."
              />
            ) : (
              <Card>
                <Card.Content style={{ gap: tokens.spacing.sm }}>
                  {group.members.map((member) => {
                    const isPending = pending.some((entry) => entry.id === member.id);
                    return (
                      <View
                        key={member.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text variant="bodyMedium" style={{ color: tokens.colors.text }}>
                          {member.emoji} {member.name}
                        </Text>
                        <Text
                          variant="labelSmall"
                          style={{
                            color: isPending ? tokens.colors.warning : tokens.colors.success,
                          }}
                        >
                          {isPending ? 'Pending' : 'Paid'}
                        </Text>
                      </View>
                    );
                  })}
                </Card.Content>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
