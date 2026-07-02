/**
 * Access the overlay API (alert, confirm, toast, modal, windows).
 * Re-exported here for the conventional hooks/ location.
 *
 * @example
 * const overlay = useOverlay();
 * if (await overlay.confirm({ message: 'Delete?' })) remove();
 */
export { useOverlay } from '@/contexts/overlayContext';
