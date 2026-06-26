import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useDesign } from '../contexts/designContext';
import { useAuth } from '../contexts/authContext';
import { DEMO_USERS, ROLE_LABELS, type Role } from '../constants/auth';

const ROLE_ORDER: Role[] = ['admin', 'user'];

export default function Login() {
  const { colors, spacing, fonts, fontSize, radii, shadow, dimensions } = useDesign();
  const { isAuthenticated, isHydrated, signInAs } = useAuth();
  const router = useRouter();

  // Wait for the persisted session before deciding what to show.
  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Already signed in — skip the login screen.
  if (isAuthenticated) {
    return <Redirect href="/sidebar/home/main" />;
  }

  const handleSignIn = async (role: Role) => {
    await signInAs(role);
    router.replace('/sidebar/home/main');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: dimensions.cardMaxWidth,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          ...shadow.lg,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <Text style={{ fontSize: fontSize.xxxl }}>💰</Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: fontSize.xxl,
              marginTop: spacing.sm,
            }}
          >
            Welcome to Mooney
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.base,
              marginTop: spacing.xs,
              textAlign: 'center',
            }}
          >
            Choose an account to sign in.
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {ROLE_ORDER.map((role) => {
            const account = DEMO_USERS[role];
            return (
              <Button
                key={role}
                mode={role === 'admin' ? 'contained' : 'outlined'}
                buttonColor={role === 'admin' ? colors.primary : undefined}
                textColor={role === 'admin' ? colors.onPrimary : colors.primary}
                labelStyle={{ fontFamily: fonts.semibold, fontSize: fontSize.base }}
                style={{ borderRadius: radii.md, borderColor: colors.primary }}
                contentStyle={{ height: dimensions.buttonHeight }}
                onPress={() => handleSignIn(role)}
              >
                {`Continue as ${ROLE_LABELS[role]}`}
              </Button>
            );
          })}
        </View>

        <Text
          style={{
            color: colors.textDisabled,
            fontFamily: fonts.regular,
            fontSize: fontSize.sm,
            textAlign: 'center',
            marginTop: spacing.lg,
          }}
        >
          Demo accounts — no password required.
        </Text>
      </Card>
    </SafeAreaView>
  );
}
