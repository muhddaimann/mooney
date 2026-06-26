import React from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { formatCurrency, type CatalogItem } from '../constants/menu';

type Props = {
  item: CatalogItem;
};

/** A selectable menu item with an inline quantity stepper. */
export default function MenuItemCard({ item }: Props) {
  const { colors, spacing, radii, fonts, fontSize, shadow } = useDesign();
  const { quantityOf, addItem, decrement } = useMenu();
  const qty = quantityOf(item.id);
  const selected = qty > 0;

  return (
    <Pressable onPress={() => addItem(item.id)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          padding: spacing.md,
          gap: spacing.sm,
          ...shadow.sm,
        }}
      >
        <Text style={{ fontSize: fontSize.xl }}>{item.emoji ?? '🍽️'}</Text>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
            {item.name}
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
            {formatCurrency(item.unitPrice)}
          </Text>
        </View>

        {selected ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon="minus"
              size={16}
              mode="contained-tonal"
              containerColor={colors.surfaceVariant}
              iconColor={colors.text}
              onPress={() => decrement(item.id)}
            />
            <Text style={{ minWidth: 24, textAlign: 'center', color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.base }}>
              {qty}
            </Text>
            <IconButton
              icon="plus"
              size={16}
              mode="contained"
              containerColor={colors.primary}
              iconColor={colors.onPrimary}
              onPress={() => addItem(item.id)}
            />
          </View>
        ) : (
          <IconButton
            icon="plus"
            size={18}
            mode="contained-tonal"
            containerColor={colors.primaryContainer}
            iconColor={colors.primary}
            onPress={() => addItem(item.id)}
          />
        )}
      </View>
    </Pressable>
  );
}
