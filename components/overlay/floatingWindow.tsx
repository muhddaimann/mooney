import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState, type ReactNode } from 'react';
import { Animated, PanResponder, Pressable, View, type ViewStyle } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { usePresenceAnim } from '@/components/overlay/usePresenceAnim';
import { useAppTheme } from '@/hooks/useAppTheme';

const MIN_WIDTH = 240;
const MIN_HEIGHT = 160;

/** `cursor` is a valid web style but absent from RN's ViewStyle typings. */
const cursor = (value: 'move' | 'nwse-resize'): ViewStyle =>
  ({ cursor: value }) as unknown as ViewStyle;

type FloatingWindowProps = {
  title: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  zIndex: number;
  focused: boolean;
  onFocus: () => void;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Non-modal floating panel: drag by the title bar, resize from the bottom-right
 * corner. Focus (z-order) is owned by the provider — pressing anywhere on the
 * window calls `onFocus`.
 */
export function FloatingWindow({
  title,
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  zIndex,
  focused,
  onFocus,
  onClose,
  children,
}: FloatingWindowProps) {
  const { tokens } = useAppTheme();
  const progress = usePresenceAnim(true, undefined, tokens.duration.fast);

  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

  // Keep latest callbacks/values reachable from the PanResponder closures.
  const posRef = useRef(pos);
  posRef.current = pos;
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;

  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0 });

  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onFocusRef.current();
        dragStart.current = { ...posRef.current };
      },
      onPanResponderMove: (_event, gesture) => {
        setPos({
          x: dragStart.current.x + gesture.dx,
          y: dragStart.current.y + gesture.dy,
        });
      },
    }),
  ).current;

  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onFocusRef.current();
        resizeStart.current = { ...sizeRef.current };
      },
      onPanResponderMove: (_event, gesture) => {
        setSize({
          width: Math.max(MIN_WIDTH, resizeStart.current.width + gesture.dx),
          height: Math.max(MIN_HEIGHT, resizeStart.current.height + gesture.dy),
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex,
        opacity: progress,
        transform: [
          { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
        ],
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.colors.surface,
        borderWidth: focused ? tokens.borderWidth.thick : tokens.borderWidth.thin,
        borderColor: focused ? tokens.colors.primary : tokens.colors.border,
        overflow: 'hidden',
        ...tokens.shadow.xl,
      }}
    >
      <View
        {...dragResponder.panHandlers}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.spacing.sm,
            paddingLeft: tokens.spacing.md,
            paddingRight: tokens.spacing.xs,
            paddingVertical: tokens.spacing.xs,
            backgroundColor: tokens.colors.surfaceVariant,
            borderBottomWidth: tokens.borderWidth.thin,
            borderBottomColor: tokens.colors.border,
          },
          cursor('move'),
        ]}
      >
        <MaterialCommunityIcons
          name="drag"
          size={tokens.iconSize.sm}
          color={tokens.colors.textSecondary}
        />
        <Text
          variant="labelLarge"
          numberOfLines={1}
          style={{ flex: 1, color: tokens.colors.text }}
        >
          {title}
        </Text>
        <IconButton icon="close" size={tokens.iconSize.sm} onPress={onClose} />
      </View>

      <Pressable style={{ flex: 1 }} onPress={onFocus}>
        <View style={{ flex: 1, padding: tokens.spacing.md }}>{children}</View>
      </Pressable>

      <View
        {...resizeResponder.panHandlers}
        style={[
          {
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 22,
            height: 22,
            alignItems: 'center',
            justifyContent: 'center',
          },
          cursor('nwse-resize'),
        ]}
      >
        <MaterialCommunityIcons
          name="resize-bottom-right"
          size={tokens.iconSize.sm}
          color={tokens.colors.textSecondary}
        />
      </View>
    </Animated.View>
  );
}
