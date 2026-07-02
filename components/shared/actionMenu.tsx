import { IconButton } from 'react-native-paper';

import { PickerModal, type PickerOption } from '@/components/shared/pickerModal';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOverlay } from '@/hooks/useOverlay';

type ActionMenuProps<T extends string> = {
  options: PickerOption<T>[];
  onSelect: (value: T) => void;
};

/**
 * Generic three-dot (`dots-vertical`) icon that opens a centered `PickerModal`
 * with the given options. This is the base every per-screen action menu
 * builds on - `ModuleMenu` wraps it with a fixed add/about/clear shape for
 * module index screens; screens with a different set of actions (e.g. a
 * group detail page) use this directly.
 *
 * @example
 * <ActionMenu
 *   options={[{ value: 'addMember', label: 'Add member', icon: 'account-plus-outline' }]}
 *   onSelect={(value) => { if (value === 'addMember') addMember(); }}
 * />
 */
export function ActionMenu<T extends string>({ options, onSelect }: ActionMenuProps<T>) {
  const { tokens } = useAppTheme();
  const overlay = useOverlay();

  const openMenu = async () => {
    const action = await overlay.modal<T>({
      render: (close) => <PickerModal options={options} onSelect={close} />,
    });
    if (action) onSelect(action);
  };

  return (
    <IconButton
      icon="dots-vertical"
      size={tokens.iconSize.md}
      onPress={openMenu}
      accessibilityLabel="More options"
    />
  );
}
