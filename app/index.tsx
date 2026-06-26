import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesign } from '../contexts/designContext';
import ThemeToggle from '../components/themeToggle';

export default function HomeScreen() {
  const { colors, spacing, fonts, fontSize, radii, shadow, dimensions } = useDesign();

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
              onPress={() => alert('Welcome to Mooney!')}
            >
              Get Started
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </SafeAreaView>
  );
}
