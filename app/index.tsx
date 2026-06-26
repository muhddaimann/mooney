import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useAppTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const tokens = useAppTheme();

  return (
    <View 
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: tokens.colors.background, 
        padding: tokens.spacing.md,
      }}
    >
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400, 
          backgroundColor: tokens.colors.surface, 
          borderRadius: 12,
          padding: tokens.spacing.sm,
        }}
      >
        <Card.Title 
          title="💰 Mooney" 
          titleStyle={{ 
            color: tokens.colors.text, 
            fontFamily: tokens.fonts.bold,
            fontSize: tokens.fontSize.xl,
            fontWeight: 'bold',
          }} 
        />
        <Card.Content>
          <Text 
            style={{ 
              color: tokens.colors.textSecondary, 
              fontFamily: tokens.fonts.regular,
              fontSize: tokens.fontSize.base,
              marginVertical: tokens.spacing.md,
            }}
          >
            Manage your money with clarity, not complexity.
          </Text>
        </Card.Content>
        <Card.Actions style={{ padding: tokens.spacing.xs }}>
          <Button 
            mode="contained" 
            buttonColor={tokens.colors.primary}
            textColor={tokens.colors.text}
            labelStyle={{ fontFamily: tokens.fonts.bold }}
            onPress={() => alert('Welcome to Mooney!')}
          >
            Get Started
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
