import React from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';
import { useMenu } from '../contexts/menuContext';
import { type CatalogItem } from '../constants/menu';

type Props = {
  item: CatalogItem;
};

/**
 * Compact, vertical menu card sized to sit in a wrapping grid (not full width).
 * Shows an Add button when unselected, a −/qty/+ stepper once chosen.
 */
export default function MenuItemCard({ item }: Props) {
  const { colors, spacing, radii, fonts, fontSize, shadow } = useDesign();
  const { quantityOf, addItem, decrement } = useMenu();
  const qty = quantityOf(item.id);
  const selected = qty > 0;

  return (
    <Pressable onPress={() => addItem(item.id)} style={{ flexGrow: 1, flexBasis: 150, maxWidth: 220 }}>
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
        <Text style={{ fontSize: fontSize.xxl }}>{item.emoji ?? '🍽️'}</Text>

        <Text numberOfLines={1} style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
          {item.name}
        </Text>

        {selected ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: spacing.xs,
            }}
          >
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              marginTop: spacing.xs,
              height: 36,
              borderRadius: radii.md,
              backgroundColor: colors.primaryContainer,
            }}
          >
            <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>＋ Add</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
