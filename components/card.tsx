import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type CardTitleProps = {
  title: string;
  subtitle?: string;
};

type CardSlotProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type CardComponent = ((props: CardProps) => ReactNode) & {
  Title: (props: CardTitleProps) => ReactNode;
  Content: (props: CardSlotProps) => ReactNode;
  Actions: (props: CardSlotProps) => ReactNode;
};

/**
 * Surface container composed from the design tokens — a token-driven stand-in
 * for Paper's Card. Use with Card.Title / Card.Content / Card.Actions.
 */
export const Card: CardComponent = ({ children, style }: CardProps) => {
  const { tokens } = useAppTheme();
  return (
    <View
      style={[
        {
          borderRadius: tokens.radii.lg,
          backgroundColor: tokens.colors.surface,
          borderWidth: tokens.borderWidth.thin,
          borderColor: tokens.colors.border,
          overflow: 'hidden',
          ...tokens.shadow.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

Card.Title = function CardTitle({ title, subtitle }: CardTitleProps) {
  const { tokens } = useAppTheme();
  return (
    <View
      style={{
        paddingHorizontal: tokens.spacing.md,
        paddingTop: tokens.spacing.md,
        paddingBottom: tokens.spacing.xs,
      }}
    >
      <Text variant="titleMedium" style={{ color: tokens.colors.text }}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodySmall" style={{ color: tokens.colors.textSecondary }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

Card.Content = function CardContent({ children, style }: CardSlotProps) {
  const { tokens } = useAppTheme();
  return (
    <View
      style={[
        { paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.sm },
        style,
      ]}
    >
      {children}
    </View>
  );
};

Card.Actions = function CardActions({ children, style }: CardSlotProps) {
  const { tokens } = useAppTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          paddingHorizontal: tokens.spacing.sm,
          paddingBottom: tokens.spacing.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
