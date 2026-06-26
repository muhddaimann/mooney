import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { useOverlay } from '../contexts/overlayContext';
import { useOrderTotals } from '../hooks/useOrderTotals';
import { formatCurrency } from '../constants/menu';

/** Sticky bill: subtotal → charges → grand total, with save / clear actions. */
export default function OrderSummary() {
  const { colors, spacing, radii, fonts, fontSize, shadow } = useDesign();
  const { clear, saveOrder } = useMenu();
  const { toast } = useOverlay();
  const { items, charges, summary } = useOrderTotals();

  const empty = items.length === 0;

  const handleSave = async () => {
    await saveOrder();
    toast({ message: 'Saved as your last order', type: 'success' });
  };

  const row = (label: string, value: string, strong = false) => (
    <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text
        style={{
          color: strong ? colors.text : colors.textSecondary,
          fontFamily: strong ? fonts.bold : fonts.regular,
          fontSize: strong ? fontSize.lg : fontSize.md,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: strong ? colors.primary : colors.text,
          fontFamily: strong ? fonts.bold : fonts.semibold,
          fontSize: strong ? fontSize.lg : fontSize.md,
        }}
      >
        {value}
      </Text>
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
        gap: spacing.xs,
        ...shadow.xl,
      }}
    >
      {empty ? (
        <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base, textAlign: 'center' }}>
          No items yet — tap to start your bill.
        </Text>
      ) : (
        <>
          {row('Subtotal', formatCurrency(summary.subtotal))}
          {charges.map((c) => row(c.name, formatCurrency(c.amount)))}
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.xs }} />
          {row('Net Total', formatCurrency(summary.grandTotal), true)}

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
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
              {`Save · ${formatCurrency(summary.grandTotal)}`}
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
