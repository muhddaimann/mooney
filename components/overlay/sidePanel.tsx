import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { useAppTheme } from '@/hooks/useAppTheme';

type SidePanelProps = {
  title?: string;
  width: number;
  dismissable: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Right-docked detail panel. Rendered inside the layout row (not the portal),
 * so the main content is pushed left to make room as the panel slides open.
 */
export function SidePanel({
  title,
  width,
  dismissable,
  onClose,
  children,
}: SidePanelProps) {
  const { tokens } = useAppTheme();

  return (
    <View
      style={{
        width,
        height: '100%',
        backgroundColor: tokens.colors.surface,
        borderLeftWidth: tokens.borderWidth.thin,
        borderLeftColor: tokens.colors.border,
        ...tokens.shadow.xl,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          paddingLeft: tokens.spacing.lg,
          paddingRight: tokens.spacing.xs,
          paddingVertical: tokens.spacing.xs,
        }}
      >
        <Text
          variant="titleMedium"
          numberOfLines={1}
          style={{ flex: 1, color: tokens.colors.text }}
        >
          {title ?? 'Details'}
        </Text>
        {dismissable ? (
          <IconButton icon="close" size={tokens.iconSize.md} onPress={onClose} />
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
