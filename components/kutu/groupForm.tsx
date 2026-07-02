import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type GroupFormValues = {
  name: string;
  contributionAmount: number;
  totalMembers: number;
};

type GroupFormProps = {
  onSubmit: (values: GroupFormValues) => void;
};

/** Create-group form: group name, contribution amount per round, and planned member count. */
export function GroupForm({ onSubmit }: GroupFormProps) {
  const { tokens } = useAppTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState('');
  const parsedAmount = Number(amount);
  const parsedMembers = Number(members);
  const valid =
    name.trim().length > 0 &&
    amount.trim().length > 0 &&
    parsedAmount > 0 &&
    members.trim().length > 0 &&
    Number.isInteger(parsedMembers) &&
    parsedMembers > 0;

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ gap: tokens.spacing.xxs }}>
        <Text variant="titleLarge" style={{ color: tokens.colors.text }}>
          New kutu group
        </Text>
        <Text variant="bodyMedium" style={{ color: tokens.colors.textSecondary }}>
          Name the group, set the contribution amount per round, and how many members will join.
        </Text>
      </View>

      <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} />
      <TextInput
        mode="outlined"
        label="Contribution amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        mode="outlined"
        label="Number of members"
        value={members}
        onChangeText={setMembers}
        keyboardType="numeric"
      />

      <Button
        mode="contained"
        disabled={!valid}
        onPress={() =>
          onSubmit({ name: name.trim(), contributionAmount: parsedAmount, totalMembers: parsedMembers })
        }
      >
        Create group
      </Button>
    </View>
  );
}
