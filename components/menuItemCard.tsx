import React from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { useOverlay } from '../contexts/overlayContext';
import { formatCurrency, type CatalogItem } from '../constants/menu';
import MenuItemDetail from './menuItemDetail';

type Props = {
  item: CatalogItem;
};

/**
 * Grid menu card. Tapping the body opens the item in the overlay window;
 * the Add button / stepper manages quantity.
 */
export default function MenuItemCard({ item }: Props) {
  const { colors, spacing, radii, fonts, fontSize, shadow } = useDesign();
  const { quantityOf, addItem, decrement } = useMenu();
  const { openWindow } = useOverlay();
  const qty = quantityOf(item.id);
  const selected = qty > 0;

  const openDetail = () => openWindow(<MenuItemDetail item={item} />, { title: item.name });

  return (
    <View style={{ flexGrow: 1, flexBasis: 150, maxWidth: 220 }}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          padding: spacing.md,
          gap: spacing.xs,
          ...shadow.sm,
        }}
      >
        <Pressable onPress={openDetail} style={{ gap: spacing.xs }}>
          <Text style={{ fontSize: fontSize.xxl }}>{item.emoji ?? '🍽️'}</Text>
          <Text numberOfLines={1} style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
            {item.name}
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
            {formatCurrency(item.unitPrice)}
          </Text>
        </Pressable>

        {selected ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs }}>
            <IconButton
              icon="minus"
              size={16}
              mode="contained-tonal"
              containerColor={colors.surfaceVariant}
              iconColor={colors.text}
              onPress={() => decrement(item.id)}
            />
            <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg }}>{qty}</Text>
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
          <Pressable
            onPress={() => addItem(item.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing.xs,
              height: 36,
              borderRadius: radii.md,
              backgroundColor: colors.primaryContainer,
            }}
          >
            <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>＋ Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
