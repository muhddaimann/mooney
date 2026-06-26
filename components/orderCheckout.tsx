import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { useOverlay } from '../contexts/overlayContext';
import { useOrderTotals } from '../hooks/useOrderTotals';
import { formatCurrency } from '../constants/menu';

type Step = 'idle' | 'name' | 'pay';

/**
 * Checkout flow: a bottom "Next" bar (no prices shown while choosing) →
 * a name modal → a payment modal that tells you what to pay.
 */
export default function OrderCheckout() {
  const { colors, spacing, radii, fonts, fontSize, shadow, dimensions } = useDesign();
  const { payerName, setPayerName, clear, saveOrder } = useMenu();
  const { toast } = useOverlay();
  const { items, charges, summary } = useOrderTotals();

  const [step, setStep] = useState<Step>('idle');

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const empty = itemCount === 0;
  const selectedSummary = items.map((i) => `${i.quantity}× ${i.name}`).join(', ');
  const name = payerName.trim();
  const close = () => setStep('idle');

  const handleSave = async () => {
    await saveOrder();
    toast({ message: name ? `Saved ${name}'s bill` : 'Order saved', type: 'success' });
    clear();
    setStep('idle');
  };

  const modalCard = {
    alignSelf: 'center',
    width: '100%',
    maxWidth: dimensions.cardMaxWidth,
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    ...shadow.xl,
  } as const;

  const row = (label: string, value: string) => (
    <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md }}>{label}</Text>
      <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.md }}>{value}</Text>
    </View>
  );

  return (
    <>
      {/* Bottom action bar */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          borderTopLeftRadius: radii.xl,
          borderTopRightRadius: radii.xl,
          padding: spacing.lg,
          ...shadow.xl,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 520,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: empty ? colors.textDisabled : colors.text,
                fontFamily: fonts.semibold,
                fontSize: fontSize.base,
              }}
            >
              {empty ? 'No items selected' : `${itemCount} item${itemCount > 1 ? 's' : ''} selected`}
            </Text>
            {!empty && (
              <Text
                numberOfLines={1}
                style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}
              >
                {selectedSummary}
              </Text>
            )}
          </View>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            textColor={colors.onPrimary}
            labelStyle={{ fontFamily: fonts.bold }}
            style={{ borderRadius: radii.md }}
            disabled={empty}
            onPress={() => setStep('name')}
          >
            Next
          </Button>
        </View>
      </View>

      <Portal>
        {/* Step 1 — who's paying */}
        <Modal visible={step === 'name'} onDismiss={close} contentContainerStyle={modalCard}>
          <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xl }}>Who’s paying?</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
            Enter a name for this bill.
          </Text>
          <TextInput
            mode="outlined"
            label="Name"
            value={payerName}
            onChangeText={setPayerName}
            autoFocus
            left={<TextInput.Icon icon="account" />}
            style={{ marginVertical: spacing.md }}
            onSubmitEditing={() => name && setStep('pay')}
          />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              mode="outlined"
              textColor={colors.textSecondary}
              style={{ flex: 1, borderRadius: radii.md, borderColor: colors.border }}
              onPress={close}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              labelStyle={{ fontFamily: fonts.bold }}
              style={{ flex: 1, borderRadius: radii.md }}
              disabled={!name}
              onPress={() => setStep('pay')}
            >
              Continue
            </Button>
          </View>
        </Modal>

        {/* Step 2 — what to pay */}
        <Modal visible={step === 'pay'} onDismiss={close} contentContainerStyle={modalCard}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base }}>
            {name ? `This is how much you need to pay, ${name}` : 'This is how much you need to pay'}
          </Text>
          <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.xxxl, marginBottom: spacing.md }}>
            {formatCurrency(summary.grandTotal)}
          </Text>

          <View style={{ gap: spacing.xs }}>
            {row('Subtotal', formatCurrency(summary.subtotal))}
            {charges.map((c) => row(c.name, formatCurrency(c.amount)))}
          </View>

          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button
              mode="outlined"
              textColor={colors.textSecondary}
              style={{ flex: 1, borderRadius: radii.md, borderColor: colors.border }}
              onPress={() => setStep('name')}
            >
              Back
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
        </Modal>
      </Portal>
    </>
  );
}
