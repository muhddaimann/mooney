import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { useOverlay } from '../contexts/overlayContext';
import { useOrderTotals } from '../hooks/useOrderTotals';
import { formatCurrency } from '../constants/menu';

/**
 * Sticky bill: name → subtotal → charges → a personalised "you need to pay"
 * callout, with save / clear actions.
 */
export default function OrderSummary() {
  const { colors, spacing, radii, fonts, fontSize, shadow } = useDesign();
  const { clear, saveOrder, payerName, setPayerName } = useMenu();
  const { toast } = useOverlay();
  const { items, charges, summary } = useOrderTotals();

  const empty = items.length === 0;
  const name = payerName.trim();

  const handleSave = async () => {
    await saveOrder();
    toast({ message: 'Saved as your last order', type: 'success' });
  };

  const row = (label: string, value: string) => (
    <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{label}</Text>
      <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.md }}>{value}</Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
        padding: spacing.lg,
        gap: spacing.sm,
        ...shadow.xl,
      }}
    >
      {empty ? (
        <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base, textAlign: 'center' }}>
          No items yet — tap to start your bill.
        </Text>
      ) : (
        <View style={{ gap: spacing.sm, width: '100%', maxWidth: 520, alignSelf: 'center' }}>
          <View style={{ gap: spacing.xs }}>
            {row('Subtotal', formatCurrency(summary.subtotal))}
            {charges.map((c) => row(c.name, formatCurrency(c.amount)))}
          </View>

          <TextInput
            mode="outlined"
            label="Your name"
            value={payerName}
            onChangeText={setPayerName}
            left={<TextInput.Icon icon="account" />}
            dense
          />

          {/* Personalised callout */}
          <View
            style={{
              backgroundColor: colors.primaryContainer,
              borderRadius: radii.lg,
              padding: spacing.md,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
              {name ? `This is how much you need to pay, ${name}` : 'This is how much you need to pay'}
            </Text>
            <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
              {formatCurrency(summary.grandTotal)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              mode="outlined"
              textColor={colors.textSecondary}
              style={{ flex: 1, borderRadius: radii.md, borderColor: colors.border }}
              onPress={clear}
            >
              Clear
            </Button>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              labelStyle={{ fontFamily: fonts.bold }}
              style={{ flex: 1, borderRadius: radii.md }}
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
