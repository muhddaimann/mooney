import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname, useRouter } from 'expo-router';
import { useDesign } from '../contexts/designContext';
import { useAuth } from '../contexts/authContext';
import { useOverlay } from '../contexts/overlayContext';
import { ROLE_LABELS } from '../constants/auth';

type NavItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Route navigated to on press. */
  href: string;
  /** Path prefix used to decide whether the item is active. */
  match: string;
  /** Only shown to admins. */
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home-variant', href: '/sidebar/home/main', match: '/sidebar/home' },
  { label: 'Menu', icon: 'silverware-fork-knife', href: '/sidebar/menu', match: '/sidebar/menu' },
  { label: 'Bill Split', icon: 'call-split', href: '/sidebar/split', match: '/sidebar/split', adminOnly: true },
  { label: 'Settings', icon: 'cog', href: '/sidebar/settings', match: '/sidebar/settings' },
];

export default function Sidebar() {
  const { colors, spacing, radii, fonts, fontSize, dimensions, iconSize, shadow, duration } =
    useDesign();
  const { user, isAdmin, signOut } = useAuth();
  const { confirm } = useOverlay();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const EXPANDED = dimensions.sidebarWidth;
  const COLLAPSED = dimensions.sidebarCollapsedWidth;

  // Drives both the pill width and the label fade from a single animation.
  const anim = useRef(new Animated.Value(1)).current; // 1 = expanded, 0 = collapsed

  useEffect(() => {
    Animated.timing(anim, {
      toValue: collapsed ? 0 : 1,
      duration: duration.normal,
      useNativeDriver: false, // width/opacity can't run on the native driver
    }).start();
  }, [collapsed, anim, duration.normal]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: [COLLAPSED, EXPANDED] });
  // Labels only fade in once the pill is most of the way open.
  const labelOpacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });

  // When collapsed, every row centers its icon; expanded, rows are left-aligned.
  const rowJustify = collapsed ? 'center' : 'flex-start';
  const rowPadding = collapsed ? 0 : spacing.sm + spacing.xs;

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out',
      message: 'Sign out of Mooney?',
      confirmLabel: 'Log out',
      destructive: true,
    });
    if (ok) {
      await signOut();
      router.replace('/');
    }
  };

  return (
    <Animated.View
      style={{
        width,
        margin: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.md,
        overflow: 'hidden',
        ...shadow.lg,
      }}
    >
      {/* Header: brand (expanded only) + collapse toggle */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: rowJustify,
          height: dimensions.buttonHeight,
          paddingLeft: collapsed ? 0 : spacing.sm,
          marginBottom: spacing.md,
        }}
      >
        {!collapsed && (
          <>
            <Text style={{ fontSize: fontSize.lg }}>💰</Text>
            <Animated.Text
              numberOfLines={1}
              style={{
                flex: 1,
                opacity: labelOpacity,
                marginLeft: spacing.sm,
                color: colors.text,
                fontFamily: fonts.bold,
                fontSize: fontSize.lg,
              }}
            >
              Mooney
            </Animated.Text>
          </>
        )}
        <Pressable
          onPress={() => setCollapsed((c) => !c)}
          accessibilityRole="button"
          accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          hitSlop={spacing.sm}
          style={{
            width: dimensions.iconButton,
            height: dimensions.iconButton,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radii.pill,
          }}
        >
          <MaterialCommunityIcons
            name={collapsed ? 'chevron-right' : 'chevron-left'}
            size={iconSize.lg}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* Nav */}
      <View style={{ gap: spacing.xs, flex: 1 }}>
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const active = pathname.startsWith(item.match);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: rowJustify,
                height: dimensions.buttonHeight,
                paddingHorizontal: rowPadding,
                borderRadius: radii.md,
                backgroundColor: active ? colors.primaryContainer : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={iconSize.lg}
                color={active ? colors.primary : colors.textSecondary}
              />
              {!collapsed && (
                <Animated.Text
                  numberOfLines={1}
                  style={{
                    opacity: labelOpacity,
                    marginLeft: spacing.sm,
                    color: active ? colors.text : colors.textSecondary,
                    fontFamily: active ? fonts.semibold : fonts.regular,
                    fontSize: fontSize.base,
                  }}
                >
                  {item.label}
                </Animated.Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* User identity */}
      {user && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: rowJustify,
            height: dimensions.buttonHeight,
            paddingHorizontal: collapsed ? 0 : spacing.xs,
            marginTop: spacing.sm,
          }}
        >
          <View
            style={{
              width: dimensions.avatarSm,
              height: dimensions.avatarSm,
              borderRadius: radii.pill,
              backgroundColor: colors.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.primary, fontFamily: fonts.bold, fontSize: fontSize.base }}>
              {user.name.charAt(0)}
            </Text>
          </View>
          {!collapsed && (
            <Animated.View style={{ flex: 1, opacity: labelOpacity, marginLeft: spacing.sm }}>
              <Text
                numberOfLines={1}
                style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.md }}
              >
                {user.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}
              >
                {ROLE_LABELS[user.role]}
              </Text>
            </Animated.View>
          )}
        </View>
      )}

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: rowJustify,
          height: dimensions.buttonHeight,
          paddingHorizontal: rowPadding,
          borderRadius: radii.md,
          marginTop: spacing.xs,
        }}
      >
        <MaterialCommunityIcons name="logout" size={iconSize.lg} color={colors.error} />
        {!collapsed && (
          <Animated.Text
            numberOfLines={1}
            style={{
              opacity: labelOpacity,
              marginLeft: spacing.sm,
              color: colors.error,
              fontFamily: fonts.semibold,
              fontSize: fontSize.base,
            }}
          >
            Log out
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
