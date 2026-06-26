import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { CATEGORY_LABELS, formatCurrency, type CatalogItem } from '../constants/menu';

/**
 * Live item detail rendered inside the overlay window panel. Subscribes to the
 * order so its quantity stepper stays in sync while the panel is open.
 */
export default function MenuItemDetail({ item }: { item: CatalogItem }) {
  const { colors, spacing, radii, fonts, fontSize, dimensions } = useDesign();
  const { quantityOf, addItem, decrement } = useMenu();
  const qty = quantityOf(item.id);

  const stepBtn = (bg: string) => ({
    width: dimensions.iconButton,
    height: dimensions.iconButton,
    borderRadius: radii.md,
    backgroundColor: bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  });

  return (
    <View style={{ gap: spacing.md }}>
      <Text style={{ fontSize: fontSize.display }}>{item.emoji ?? '🍽️'}</Text>

      <View>
        <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xl }}>{item.name}</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
          {CATEGORY_LABELS[item.category]}
        </Text>
      </View>

      <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
        {formatCurrency(item.unitPrice)}
      </Text>

      {qty > 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Pressable onPress={() => decrement(item.id)} style={stepBtn(colors.surfaceVariant)}>
            <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
          </Pressable>
          <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg, minWidth: 24, textAlign: 'center' }}>
            {qty}
          </Text>
          <Pressable onPress={() => addItem(item.id)} style={stepBtn(colors.primary)}>
            <MaterialCommunityIcons name="plus" size={18} color={colors.onPrimary} />
          </Pressable>
          <Text style={{ flex: 1, textAlign: 'right', color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
            {formatCurrency(item.unitPrice * qty)}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => addItem(item.id)}
          style={{
            height: dimensions.buttonHeight,
            borderRadius: radii.md,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.onPrimary, fontFamily: fonts.bold, fontSize: fontSize.base }}>Add to order</Text>
        </Pressable>
      )}
    </View>
  );
}
