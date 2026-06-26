import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname, useRouter } from 'expo-router';
import { useDesign } from '../contexts/designContext';
import { useAuth } from '../contexts/authContext';
import { useOverlay } from '../contexts/overlayContext';
import { ROLE_LABELS } from '../constants/auth';
import ThemeToggle from './themeToggle';

type NavItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Route navigated to on press. */
  href: string;
  /** Path prefix used to decide whether the item is active. */
  match: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'home-variant', href: '/sidebar/home/main', match: '/sidebar/home' },
  { label: 'Settings', icon: 'cog', href: '/sidebar/settings', match: '/sidebar/settings' },
];

export default function Sidebar() {
  const { colors, spacing, radii, fonts, fontSize, dimensions, iconSize, shadow, duration } =
    useDesign();
  const { user, signOut } = useAuth();
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
      {/* Header: brand + collapse toggle */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: dimensions.buttonHeight,
          paddingLeft: spacing.sm,
          marginBottom: spacing.md,
        }}
      >
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
        {NAV_ITEMS.map((item) => {
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
                height: dimensions.buttonHeight,
                paddingHorizontal: spacing.sm + spacing.xs,
                borderRadius: radii.md,
                backgroundColor: active ? colors.primaryContainer : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={iconSize.lg}
                color={active ? colors.primary : colors.textSecondary}
              />
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
            height: dimensions.buttonHeight,
            paddingHorizontal: spacing.xs,
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
          height: dimensions.buttonHeight,
          paddingHorizontal: spacing.sm + spacing.xs,
          borderRadius: radii.md,
          marginTop: spacing.xs,
        }}
      >
        <MaterialCommunityIcons name="logout" size={iconSize.lg} color={colors.error} />
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
      </Pressable>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          paddingTop: spacing.md,
          marginTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Animated.Text
          numberOfLines={1}
          style={{
            opacity: labelOpacity,
            color: colors.textSecondary,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            // Removed from layout flow when collapsed so the toggle stays centered.
            position: collapsed ? 'absolute' : 'relative',
          }}
        >
          Appearance
        </Animated.Text>
        <ThemeToggle />
      </View>
    </Animated.View>
  );
}
