import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDesign } from '../../../contexts/designContext';
import { useOverlay } from '../../../contexts/overlayContext';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function HomeDemo() {
  const { colors, spacing, fonts, fontSize, radii, shadow, iconSize, dimensions } = useDesign();
  const { confirm, alert, showLoading, hideLoading, toast, showModal, hideModal, openWindow } =
    useOverlay();

  const demoLoading = () => {
    showLoading('Loading…');
    setTimeout(hideLoading, 1500);
  };

  const demoConfirmDefault = async () => {
    const ok = await confirm({
      title: 'Save changes?',
      message: 'Your changes will be applied right away.',
      confirmLabel: 'Save',
    });
    toast({ message: ok ? 'Saved' : 'Cancelled', type: ok ? 'success' : 'info' });
  };

  const demoConfirmDestructive = async () => {
    const ok = await confirm({
      title: 'Delete item?',
      message: 'Are you sure? This can’t be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      destructive: true,
    });
    toast({ message: ok ? 'Deleted' : 'Kept', type: ok ? 'error' : 'info' });
  };

  const demoWindow = () =>
    openWindow(
      <View style={{ gap: spacing.md }}>
        <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xl }}>Espresso</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base }}>
          A detail panel slides in from the right and pushes the page content to the left — handy for
          inspecting an item without leaving the list.
        </Text>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>Price</Text>
          <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.lg }}>RM 9.90</Text>
        </View>
      </View>,
      { title: 'Item detail' },
    );

  const demoModal = () =>
    showModal(
      <View style={{ gap: spacing.md }}>
        <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.lg }}>Modal example</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base }}>
          Any content can render inside the overlay modal.
        </Text>
        <Pressable
          onPress={hideModal}
          style={{ height: dimensions.buttonHeight, borderRadius: radii.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.onPrimary, fontFamily: fonts.bold, fontSize: fontSize.base }}>Close</Text>
        </Pressable>
      </View>,
    );

  type Row = { icon: IconName; title: string; subtitle: string; accent: string; onPress: () => void };

  const rows: Row[] = [
    { icon: 'loading', title: 'Loading', subtitle: 'Full-screen spinner + message', accent: colors.primary, onPress: demoLoading },
    { icon: 'information', title: 'Alert', subtitle: 'Single acknowledge button', accent: colors.info, onPress: () => alert({ title: 'Heads up', message: 'This is an alert.' }) },
    { icon: 'check-circle', title: 'Confirm · default', subtitle: 'Two choices, resolves a boolean', accent: colors.primary, onPress: demoConfirmDefault },
    { icon: 'alert-octagon', title: 'Confirm · destructive', subtitle: '“Are you sure?” — danger action', accent: colors.error, onPress: demoConfirmDestructive },
    { icon: 'check', title: 'Toast · success', subtitle: 'Green transient message', accent: colors.success, onPress: () => toast({ message: 'Saved successfully', type: 'success' }) },
    { icon: 'close-circle', title: 'Toast · error', subtitle: 'Red transient message', accent: colors.error, onPress: () => toast({ message: 'Something went wrong', type: 'error' }) },
    { icon: 'information-outline', title: 'Toast · info', subtitle: 'Neutral transient message', accent: colors.info, onPress: () => toast({ message: 'Just so you know…', type: 'info' }) },
    { icon: 'alert', title: 'Toast · warning', subtitle: 'Amber transient message', accent: colors.warning, onPress: () => toast({ message: 'Double-check this', type: 'warning' }) },
    { icon: 'gesture-tap-button', title: 'Toast · with action', subtitle: 'Includes a tappable action', accent: colors.primary, onPress: () => toast({ message: 'Item archived', type: 'info', actionLabel: 'Undo', onAction: () => toast({ message: 'Restored', type: 'success' }) }) },
    { icon: 'card-text', title: 'Modal', subtitle: 'Custom content in a centered card', accent: colors.secondary, onPress: demoModal },
    { icon: 'dock-right', title: 'Window', subtitle: 'Right-side panel — pushes content left', accent: colors.secondary, onPress: demoWindow },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 640, gap: spacing.lg }}>
        <View>
          <Text style={{ color: colors.text, fontFamily: fonts.bold, fontSize: fontSize.xxl }}>
            🧪 Overlay demo
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.base, marginTop: spacing.xs }}>
            Tap a row to trigger each overlay primitive.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            ...shadow.sm,
          }}
        >
          {rows.map((r, i) => (
            <Pressable
              key={r.title}
              onPress={r.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.border,
              }}
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
                <MaterialCommunityIcons name={r.icon} size={iconSize.md} color={r.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: fonts.semibold, fontSize: fontSize.base }}>
                  {r.title}
                </Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.regular, fontSize: fontSize.sm }}>
                  {r.subtitle}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={iconSize.md} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
