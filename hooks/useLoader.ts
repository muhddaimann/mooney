import { useOverlay } from '@/contexts/overlayContext';

/**
 * Access just the blocking loader controls. Re-exported here for the
 * conventional hooks/ location.
 *
 * @example
 * const { withLoader } = useLoader();
 * await withLoader(saveProfile(profile), 'Saving…');
 */
export function useLoader() {
  const { showLoader, hideLoader, withLoader } = useOverlay();
  return { showLoader, hideLoader, withLoader };
}
