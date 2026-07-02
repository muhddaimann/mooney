import { IconButton } from 'react-native-paper';

import { PickerModal, type PickerOption } from '@/components/shared/pickerModal';
import { useThemeMode } from '@/contexts/themeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuth, useManageProfile, useSignOut } from '@/hooks/useAuth';
import { useOverlay } from '@/hooks/useOverlay';

type ProfileMenuAction = 'manage' | 'theme' | 'signout';

/**
 * Hamburger icon that opens a centered picker modal: manage profile, toggle
 * theme, sign out. Goes through `overlay.modal` + `PickerModal` rather than
 * a positioned dropdown.
 */
export function ProfileMenu() {
  const { tokens } = useAppTheme();
  const overlay = useOverlay();
  const { mode, toggleTheme } = useThemeMode();
  const { profile, setProfile } = useAuth();
  const manageProfile = useManageProfile();
  const signOut = useSignOut();

  const handleToggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    toggleTheme();
    if (profile) setProfile({ ...profile, theme: next });
  };

  const openMenu = async () => {
    const options: PickerOption<ProfileMenuAction>[] = [
      { value: 'manage', label: 'Manage profile', icon: 'account-edit' },
      {
        value: 'theme',
        label: 'Toggle theme',
        icon: mode === 'dark' ? 'weather-sunny' : 'weather-night',
      },
      { value: 'signout', label: 'Sign out', icon: 'logout', destructive: true, divider: true },
    ];

    const action = await overlay.modal<ProfileMenuAction>({
      render: (close) => <PickerModal options={options} onSelect={close} />,
    });

    if (action === 'manage') manageProfile(profile ?? undefined);
    else if (action === 'theme') handleToggleTheme();
    else if (action === 'signout') signOut();
  };

  return (
    <IconButton
      icon="menu"
      size={tokens.iconSize.md}
      onPress={openMenu}
      accessibilityLabel="Menu"
    />
  );
}
