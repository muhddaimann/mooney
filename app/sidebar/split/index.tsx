import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDesign } from '../../../contexts/designContext';
import { useSplit } from '../../../contexts/splitContext';
import { formatCurrency, groupTotal } from '../../../constants/split';

export default function SplitGroups() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();
  const { groups, createGroup } = useSplit();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const group = createGroup(name, description);
    setName('');
    setDescription('');
    router.push(`/sidebar/split/${group.id}`);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
    >
      <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
        Bill Split
      </Text>

      {/* Create group */}
      <Card style={{ backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, ...shadow.md }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.semibold,
            fontSize: fontSize.lg,
            marginBottom: spacing.md,
          }}
        >
          New group
        </Text>
        <TextInput
          mode="outlined"
          label="Group name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: spacing.sm }}
        />
        <TextInput
          mode="outlined"
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          style={{ marginBottom: spacing.md }}
        />
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          labelStyle={{ fontFamily: fonts.bold }}
          style={{ borderRadius: radii.md }}
          disabled={!name.trim()}
          onPress={handleCreate}
        >
          Create group
        </Button>
      </Card>

      {/* Existing groups */}
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>
        Your groups ({groups.length})
      </Text>

      {groups.length === 0 ? (
        <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base }}>
          No groups yet. Create one above to get started.
        </Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {groups.map((group) => (
            <Pressable key={group.id} onPress={() => router.push(`/sidebar/split/${group.id}`)}>
              <Card style={{ backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.md, ...shadow.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.lg }}
                    >
                      {group.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                      {group.members.length} members · {group.expenses.length} expenses
                    </Text>
                  </View>
                  <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.lg }}>
                    {formatCurrency(groupTotal(group))}
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
