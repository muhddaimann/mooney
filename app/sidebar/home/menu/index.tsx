import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Searchbar, Text } from 'react-native-paper';
import { useDesign } from '../../../../contexts/designContext';
import { useMenu } from '../../../../contexts/menuContext';
import { useOverlay } from '../../../../contexts/overlayContext';
import { CATALOG, catalogByCategory, catalogItem } from '../../../../constants/menu';
import MenuItemCard from '../../../../components/menuItemCard';
import OrderCheckout from '../../../../components/orderCheckout';
import { Skeleton } from '../../../../components/skeleton';

// Reference receipt the catalog was transcribed from.
const RECEIPT = require('../../../../constants/receipt.jpeg');

export default function MenuScreen() {
  const { colors, spacing, fonts, fontSize, radii, shadow } = useDesign();
  const { lastOrder, reorderLast } = useMenu();
  const { showModal, refreshNonce } = useOverlay();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Skeleton on first load and on every refresh.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [refreshNonce]);

  const q = query.trim().toLowerCase();
  const filtered = q ? CATALOG.filter((i) => i.name.toLowerCase().includes(q)) : CATALOG;
  const sections = catalogByCategory(filtered);

  const lastNames = lastOrder
    .map((l) => catalogItem(l.itemId))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .map((i) => i.name);

  const openReceipt = () =>
    showModal(
      <Image source={RECEIPT} resizeMode="contain" style={{ width: '100%', height: 560, borderRadius: radii.md }} />,
    );

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Column 1: selection + checkout */}
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
          <View style={{ gap: spacing.lg }}>
            {/* Prompt */}
            <View>
              <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
                What did you eat last time?
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
                Tap items to rebuild your bill — we’ll add service charge & tax.
              </Text>
            </View>

            {/* Search */}
            <Searchbar
              placeholder="Search menu"
              value={query}
              onChangeText={setQuery}
              elevation={0}
              style={{ backgroundColor: colors.surfaceVariant, borderRadius: radii.md }}
              inputStyle={{ color: colors.text, fontFamily: fonts.regular, minHeight: 0 }}
              placeholderTextColor={colors.textSecondary}
              iconColor={colors.textSecondary}
            />

            {/* Recall last order — hidden while searching */}
            {!q && lastNames.length > 0 && (
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

            {/* Catalog */}
            {loading ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <View key={i} style={{ flexGrow: 1, flexBasis: 150, maxWidth: 220 }}>
                    <Skeleton height={132} radius={radii.lg} />
                  </View>
                ))}
              </View>
            ) : sections.length === 0 ? (
              <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base }}>
                No items match “{query.trim()}”.
              </Text>
            ) : (
              sections.map((section) => (
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
              ))
            )}
          </View>
        </ScrollView>

        {/* Checkout sits under column 1 only */}
        <OrderCheckout />
      </View>

      {/* Column 2: receipt reference (always shown) */}
      <View style={{ width: 380, paddingVertical: spacing.lg, paddingRight: spacing.lg, gap: spacing.sm }}>
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
    </View>
  );
}
