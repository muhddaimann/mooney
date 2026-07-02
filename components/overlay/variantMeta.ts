import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

import { type Tokens } from '@/constants/theme';
import { type ToastVariant } from '@/contexts/overlayTypes';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Maps an alert/toast variant to its accent color and icon, resolved against
 * the active theme tokens.
 */
export function variantMeta(
  tokens: Tokens,
  variant: ToastVariant,
): { color: string; icon: IconName } {
  switch (variant) {
    case 'success':
      return { color: tokens.colors.success, icon: 'check-circle' };
    case 'warning':
      return { color: tokens.colors.warning, icon: 'alert' };
    case 'error':
      return { color: tokens.colors.error, icon: 'close-circle' };
    case 'info':
    default:
      return { color: tokens.colors.info, icon: 'information' };
  }
}
