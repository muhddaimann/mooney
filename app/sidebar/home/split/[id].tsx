import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDesign } from '../../../../contexts/designContext';
import { useSplit } from '../../../../contexts/splitContext';
import { useOverlay } from '../../../../contexts/overlayContext';
import { useGroupBalances } from '../../../../hooks/useGroupBalances';
import { formatCurrency, memberName } from '../../../../constants/split';

export default function GroupDetail() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroup, addMember, removeMember, addExpense, removeExpense, deleteGroup } = useSplit();
  const { confirm, toast } = useOverlay();
  const router = useRouter();

  const group = getGroup(id);
  const { balances, settlements, total } = useGroupBalances(group);

  // Form state
  const [memberName_, setMemberName] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<string | null>(null);

  if (!group) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base }}>
          Group not found.
        </Text>
        <Button textColor={colors.primary} onPress={() => router.replace('/sidebar/home/split')}>
          Back to groups
        </Button>
      </View>
    );
  }

  const handleAddMember = () => {
    if (!memberName_.trim()) return;
    addMember(group.id, memberName_);
    setMemberName('');
  };

  const handleAddExpense = () => {
    const value = parseFloat(amount);
    if (!title.trim() || !paidBy || !Number.isFinite(value) || value <= 0) {
      toast({ message: 'Enter a title, amount and who paid.', type: 'warning' });
      return;
    }
    addExpense(group.id, { title, amount: value, paidByMemberId: paidBy });
    setTitle('');
    setAmount('');
    setPaidBy(null);
  };

  const handleDeleteGroup = async () => {
    const ok = await confirm({
      title: 'Delete group',
      message: `Delete "${group.name}" and all its expenses?`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (ok) {
      deleteGroup(group.id);
      router.replace('/sidebar/home/split');
    }
  };

  const sectionTitle = {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: fontSize.lg,
    marginBottom: spacing.sm,
  } as const;

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow.md,
  } as const;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
            {group.name}
          </Text>
          {group.description ? (
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }}>
              {group.description}
            </Text>
          ) : null}
          <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.lg, marginTop: spacing.xs }}>
            Total {formatCurrency(total)}
          </Text>
        </View>
        <IconButton icon="trash-can-outline" iconColor={colors.error} onPress={handleDeleteGroup} />
      </View>

      {/* Members */}
      <Card style={cardStyle}>
        <Text style={sectionTitle}>Members ({group.members.length})</Text>
        {group.members.length === 0 ? (
          <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base, marginBottom: spacing.md }}>
            Add people to split bills between.
          </Text>
        ) : (
          <View style={{ gap: spacing.xs, marginBottom: spacing.md }}>
            {group.members.map((m) => (
              <View
                key={m.id}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Text style={{ color: colors.text, fontFamily: fonts.regular, fontSize: fontSize.base }}>
                  {m.name}
                </Text>
                <IconButton icon="close" size={16} iconColor={colors.textSecondary} onPress={() => removeMember(group.id, m.id)} />
              </View>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <TextInput
            mode="outlined"
            label="Member name"
            value={memberName_}
            onChangeText={setMemberName}
            onSubmitEditing={handleAddMember}
            style={{ flex: 1 }}
          />
          <Button
            mode="contained-tonal"
            onPress={handleAddMember}
            disabled={!memberName_.trim()}
            style={{ borderRadius: radii.md }}
          >
            Add
          </Button>
        </View>
      </Card>

      {/* Add expense */}
      <Card style={cardStyle}>
        <Text style={sectionTitle}>Add expense</Text>
        {group.members.length === 0 ? (
          <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base }}>
            Add at least one member first.
          </Text>
        ) : (
          <>
            <TextInput
              mode="outlined"
              label="What for?"
              value={title}
              onChangeText={setTitle}
              style={{ marginBottom: spacing.sm }}
            />
            <TextInput
              mode="outlined"
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              left={<TextInput.Affix text="$" />}
              style={{ marginBottom: spacing.md }}
            />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm, marginBottom: spacing.xs }}>
              Paid by
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md }}>
              {group.members.map((m) => {
                const selected = paidBy === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setPaidBy(m.id)}
                    style={{
                      paddingVertical: spacing.xs,
                      paddingHorizontal: spacing.md,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primaryContainer : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? colors.primary : colors.textSecondary,
                        fontFamily: selected ? fonts.semibold : fonts.regular,
                        fontSize: fontSize.md,
                      }}
                    >
                      {m.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.sm, marginBottom: spacing.md }}>
              Split equally between all {group.members.length} members.
            </Text>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              labelStyle={{ fontFamily: fonts.bold }}
              style={{ borderRadius: radii.md }}
              onPress={handleAddExpense}
            >
              Add expense
            </Button>
          </>
        )}
      </Card>

      {/* Expenses */}
      {group.expenses.length > 0 && (
        <Card style={cardStyle}>
          <Text style={sectionTitle}>Expenses</Text>
          <View style={{ gap: spacing.sm }}>
            {group.expenses.map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                    {e.title}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                    {memberName(group, e.paidByMemberId)} paid · split {e.participantIds.length} ways
                  </Text>
                </View>
                <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.base, marginRight: spacing.xs }}>
                  {formatCurrency(e.amount)}
                </Text>
                <IconButton icon="close" size={16} iconColor={colors.textSecondary} onPress={() => removeExpense(group.id, e.id)} />
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Balances */}
      {balances.length > 0 && group.expenses.length > 0 && (
        <Card style={cardStyle}>
          <Text style={sectionTitle}>Balances</Text>
          <View style={{ gap: spacing.xs }}>
            {balances.map((b) => {
              const owed = b.net > 0;
              const settled = Math.abs(b.net) < 0.005;
              return (
                <View key={b.memberId} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontFamily: fonts.regular, fontSize: fontSize.base }}>
                    {memberName(group, b.memberId)}
                  </Text>
                  <Text
                    style={{
                      color: settled ? colors.textSecondary : owed ? colors.success : colors.error,
                      fontFamily: fonts.semibold,
                      fontSize: fontSize.base,
                    }}
                  >
                    {settled ? 'settled' : owed ? `gets ${formatCurrency(b.net)}` : `owes ${formatCurrency(-b.net)}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* Settlements */}
      {settlements.length > 0 && (
        <Card style={cardStyle}>
          <Text style={sectionTitle}>Settle up</Text>
          <View style={{ gap: spacing.sm }}>
            {settlements.map((s, i) => (
              <View key={`${s.fromMemberId}-${s.toMemberId}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                  {memberName(group, s.fromMemberId)}
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color={colors.textSecondary} />
                <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                  {memberName(group, s.toMemberId)}
                </Text>
                <Text style={{ flex: 1, textAlign: 'right', color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.base }}>
                  {formatCurrency(s.amount)}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}
