import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesign } from '../contexts/designContext';
import { useOverlay } from '../contexts/overlayContext';
import ThemeToggle from '../components/themeToggle';

export default function HomeScreen() {
  const { colors, spacing, fonts, fontSize, radii, shadow, dimensions } = useDesign();
  const { confirm, showLoading, hideLoading, toast } = useOverlay();

  const handleGetStarted = async () => {
    const ready = await confirm({
      title: 'Get started',
      message: 'Set up your Mooney workspace now?',
      confirmLabel: 'Let’s go',
      cancelLabel: 'Maybe later',
    });
    if (!ready) return;

    showLoading('Setting things up…');
    setTimeout(() => {
      hideLoading();
      toast({ message: 'Welcome to Mooney!', type: 'success' });
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: spacing.md,
          height: dimensions.headerHeight,
          alignItems: 'center',
        }}
      >
        <ThemeToggle />
      </View>

      <View
        style={{
          flex: 1,
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
            padding: spacing.sm,
            ...shadow.lg,
          }}
        >
          <Card.Title
            title="💰 Mooney"
            titleStyle={{
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: fontSize.xl,
            }}
          />
          <Card.Content>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fonts.regular,
                fontSize: fontSize.base,
                marginVertical: spacing.md,
              }}
            >
              Manage your money with clarity, not complexity.
            </Text>
          </Card.Content>
          <Card.Actions style={{ padding: spacing.xs }}>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              labelStyle={{ fontFamily: fonts.bold }}
              style={{ borderRadius: radii.md }}
              onPress={handleGetStarted}
            >
              Get Started
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </SafeAreaView>
  );
}
