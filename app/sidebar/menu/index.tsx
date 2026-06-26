import React from 'react';
import { Image, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useDesign } from '../../../contexts/designContext';
import { useMenu } from '../../../contexts/menuContext';
import { useOverlay } from '../../../contexts/overlayContext';
import { catalogByCategory, catalogItem } from '../../../constants/menu';
import MenuItemCard from '../../../components/menuItemCard';
import OrderCheckout from '../../../components/orderCheckout';

// Reference receipt the catalog was transcribed from.
const RECEIPT = require('../../../constants/receipt.jpeg');

export default function MenuScreen() {
  const { colors, spacing, fonts, fontSize, radii, shadow, breakpoints } = useDesign();
  const { lastOrder, reorderLast } = useMenu();
  const { showModal } = useOverlay();
  const { width } = useWindowDimensions();

  // Enough room for a dedicated reference column alongside the sidebar.
  const showReceiptColumn = width >= breakpoints.lg;

  const sections = catalogByCategory();
  const lastNames = lastOrder
    .map((l) => catalogItem(l.itemId))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .map((i) => i.name);

  const openReceipt = () =>
    showModal(
      <Image
        source={RECEIPT}
        resizeMode="contain"
        style={{ width: '100%', height: 560, borderRadius: radii.md }}
      />,
    );

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Left: selection */}
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: 760, gap: spacing.lg }}>
            {/* Prompt */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
                  What did you eat last time?
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
                  Tap items to rebuild your bill — we’ll add service charge & tax.
                </Text>
              </View>
              {/* Fallback when the reference column is hidden */}
              {!showReceiptColumn && (
                <Button
                  mode="outlined"
                  icon="receipt"
                  compact
                  textColor={colors.primary}
                  style={{ borderRadius: radii.md, borderColor: colors.border }}
                  onPress={openReceipt}
                >
                  Receipt
                </Button>
              )}
            </View>

            {/* Recall last order */}
            {lastNames.length > 0 && (
              <Card style={{ backgroundColor: colors.primaryContainer, borderRadius: radii.lg, padding: spacing.md, ...shadow.sm }}>
                <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.md }}>
                  Last time you had
                </Text>
                <Text numberOfLines={2} style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm, marginVertical: spacing.xs }}>
                  {lastNames.join(', ')}
                </Text>
                <Button
                  mode="contained"
                  buttonColor={colors.primary}
                  textColor={colors.onPrimary}
                  labelStyle={{ fontFamily: fonts.semibold }}
                  style={{ borderRadius: radii.md, alignSelf: 'flex-start' }}
                  onPress={reorderLast}
                >
                  Order again
                </Button>
              </Card>
            )}

            {/* Catalog by category — wrapping card grid */}
            {sections.map((section) => (
              <View key={section.category} style={{ gap: spacing.sm }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>
                  {section.label}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {section.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Checkout: Next → name → payment */}
        <OrderCheckout />
      </View>

      {/* Right: receipt reference */}
      {showReceiptColumn && (
        <View
          style={{
            width: 380,
            paddingVertical: spacing.lg,
            paddingRight: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>
            Receipt reference
          </Text>
          <Pressable
            onPress={openReceipt}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.sm,
              ...shadow.sm,
            }}
          >
            <Image source={RECEIPT} resizeMode="contain" style={{ flex: 1, width: '100%' }} />
          </Pressable>
          <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.sm, textAlign: 'center' }}>
            Tap to enlarge
          </Text>
        </View>
      )}
    </View>
  );
}
