import { ActionMenu } from '@/components/shared/actionMenu';
import { ModuleAboutView, type ModuleAboutContent } from '@/components/shared/moduleAbout';
import { type PickerOption } from '@/components/shared/pickerModal';
import { useOverlay } from '@/hooks/useOverlay';

type ModuleMenuAction = 'add' | 'about' | 'clear';

type ModuleMenuProps = {
  /** Label for the primary "add" action, e.g. "Add group". */
  addLabel: string;
  onAdd: () => void;
  /** Label for the destructive "clear all" action, e.g. "Clear all groups". */
  clearLabel: string;
  onClearAll: () => void;
  about: ModuleAboutContent;
};

/**
 * Three-dot menu for a module's index screen: add, About (what the module is
 * + how to use it), and clear all (confirmed, destructive). A fixed shape on
 * top of `ActionMenu` - shared so every module's index screen gets the same
 * menu instead of a bespoke button.
 */
export function ModuleMenu({ addLabel, onAdd, clearLabel, onClearAll, about }: ModuleMenuProps) {
  const overlay = useOverlay();

  const options: PickerOption<ModuleMenuAction>[] = [
    { value: 'add', label: addLabel, icon: 'plus' },
    { value: 'about', label: 'About', icon: 'information-outline' },
    {
      value: 'clear',
      label: clearLabel,
      icon: 'delete-outline',
      destructive: true,
      divider: true,
    },
  ];

  const handleSelect = async (action: ModuleMenuAction) => {
    if (action === 'add') {
      onAdd();
      return;
    }
    if (action === 'about') {
      overlay.modal({ render: () => <ModuleAboutView content={about} /> });
      return;
    }
    const confirmed = await overlay.confirm({
      title: `${clearLabel}?`,
      message: 'This cannot be undone.',
      confirmLabel: clearLabel,
      destructive: true,
    });
    if (confirmed) onClearAll();
  };

  return <ActionMenu options={options} onSelect={handleSelect} />;
}
