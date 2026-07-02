import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/shared/header';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useKutu, useRecordContribution } from '@/hooks/useKutu';

export default function AddContributionScreen() {
  const { styles, tokens } = useAppTheme();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { groups } = useKutu();
  const recordContribution = useRecordContribution();
  const router = useRouter();

  const group = groups.find((entry) => entry.id === groupId);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [amount, setAmount] = useState(group ? String(group.contributionAmount) : '');

  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: tokens.spacing.lg }}>
          <Header title="Group not found" showBack />
        </View>
      </SafeAreaView>
    );
  }

  const parsedAmount = Number(amount);
  const valid = memberId !== null && amount.trim().length > 0 && parsedAmount > 0;

  const handleSubmit = async () => {
    if (!valid || !memberId) return;
    await recordContribution(group.id, { memberId, amount: parsedAmount });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: tokens.spacing.lg }}
      >
        <View style={{ gap: tokens.spacing.xl }}>
          <Header
            title="Record contribution"
            subtitle={`${group.name} · Round ${group.currentRound}`}
            showBack
          />

          <View style={{ gap: tokens.spacing.sm }}>
            <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
              Who paid?
            </Text>
            {group.members.map((member) => {
              const selected = member.id === memberId;
              return (
                <Pressable
                  key={member.id}
                  onPress={() => setMemberId(member.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: tokens.spacing.sm,
                    padding: tokens.spacing.md,
                    borderRadius: tokens.radii.md,
                    borderWidth: tokens.borderWidth.thin,
                    borderColor: selected ? tokens.colors.primary : tokens.colors.border,
                    backgroundColor: selected
                      ? tokens.colors.primaryContainer
                      : tokens.colors.surfaceVariant,
                  }}
                >
                  <Text style={{ fontSize: tokens.fontSize.lg }}>{member.emoji}</Text>
                  <Text variant="bodyMedium" style={{ color: tokens.colors.text }}>
                    {member.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            mode="outlined"
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Button mode="contained" disabled={!valid} onPress={handleSubmit}>
            Save contribution
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
