import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useDesign } from '../../../contexts/designContext';
import { useMenu } from '../../../contexts/menuContext';
import { catalogByCategory, catalogItem } from '../../../constants/menu';
import MenuItemCard from '../../../components/menuItemCard';
import OrderSummary from '../../../components/orderSummary';

export default function MenuScreen() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();
  const { lastOrder, reorderLast } = useMenu();

  const sections = catalogByCategory();
  const lastNames = lastOrder
    .map((l) => catalogItem(l.itemId))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .map((i) => i.name);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        {/* Prompt */}
        <View>
          <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
            What did you eat last time?
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
            Tap items to rebuild your bill — we’ll add service charge & tax.
          </Text>
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

        {/* Catalog by category */}
        {sections.map((section) => (
          <View key={section.category} style={{ gap: spacing.sm }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>
              {section.label}
            </Text>
            {section.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Sticky bill */}
      <OrderSummary />
    </View>
  );
}
