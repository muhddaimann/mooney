import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useDesign } from '../../../contexts/designContext';
import { useAuth } from '../../../contexts/authContext';
import { useSplit } from '../../../contexts/splitContext';
import { useMenu } from '../../../contexts/menuContext';
import { formatCurrency as formatSplit, groupTotal } from '../../../constants/split';
import { catalogItem } from '../../../constants/menu';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function HomeIndex() {
  const { colors, spacing, fonts, fontSize, radii, shadow, iconSize } = useDesign();
  const { user } = useAuth();
  const { groups } = useSplit();
  const { lastOrder } = useMenu();
  const router = useRouter();

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const modules: { key: string; icon: IconName; title: string; description: string; href: string }[] = [
    {
      key: 'menu',
      icon: 'silverware-fork-knife',
      title: 'Menu',
      description: 'Translate a bill into your share — pick what you ate and get the total with service charge & tax.',
      href: '/sidebar/home/menu',
    },
    {
      key: 'split',
      icon: 'call-split',
      title: 'Bill Split',
      description: 'Create a small group, enter transactions and who paid, then settle up who owes whom.',
      href: '/sidebar/home/split',
    },
  ];

  const recentGroups = [...groups].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  const lastOrderNames = lastOrder
    .map((l) => catalogItem(l.itemId))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .map((i) => i.name);
  const hasActivity = recentGroups.length > 0 || lastOrderNames.length > 0;

  const cardBase = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.sm,
  } as const;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 820, gap: spacing.lg }}>
        {/* Greeting */}
        <View>
          <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
            Hi, {firstName} 👋
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
            What would you like to do?
          </Text>
        </View>

        {/* Module cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {modules.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => router.push(m.href)}
              style={{ flexGrow: 1, flexBasis: 260 }}
            >
              <View style={{ ...cardBase, gap: spacing.sm, minHeight: 160 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radii.md,
                    backgroundColor: colors.primaryContainer,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons name={m.icon} size={iconSize.lg} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg }}>
                  {m.title}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.md, flex: 1 }}>
                  {m.description}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: fontSize.md }}>Open</Text>
                  <MaterialCommunityIcons name="arrow-right" size={iconSize.sm} color={colors.primary} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Latest updates */}
        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.lg }}>
            Latest updates
          </Text>

          {!hasActivity ? (
            <View style={cardBase}>
              <Text style={{ color: colors.textDisabled, fontFamily: fonts.regular, fontSize: fontSize.base, textAlign: 'center' }}>
                Nothing yet. Your recent groups and orders will show up here.
              </Text>
            </View>
          ) : (
            <View style={{ ...cardBase, gap: spacing.md }}>
              {/* Recent split groups */}
              {recentGroups.map((g) => (
                <Pressable
                  key={g.id}
                  onPress={() => router.push(`/sidebar/home/split/${g.id}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radii.md,
                      backgroundColor: colors.surfaceVariant,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="call-split" size={iconSize.md} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                      {g.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                      {g.members.length} members · {g.expenses.length} transactions
                    </Text>
                  </View>
                  <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.base }}>
                    {formatSplit(groupTotal(g))}
                  </Text>
                </Pressable>
              ))}

              {/* Last menu order */}
              {lastOrderNames.length > 0 && (
                <Pressable
                  onPress={() => router.push('/sidebar/home/menu')}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radii.md,
                      backgroundColor: colors.surfaceVariant,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="silverware-fork-knife" size={iconSize.md} color={colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                      Last menu order
                    </Text>
                    <Text numberOfLines={1} style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                      {lastOrderNames.join(', ')}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
