import { useOverlay } from '@/contexts/overlayContext';

/**
 * Access just the docked detail-panel controls. Opening a panel pushes the
 * app content to the left to reveal it.
 *
 * @example
 * const { openPanel } = usePanel();
 * openPanel({ title: item.name, render: () => <ItemDetail item={item} /> });
 */
export function usePanel() {
  const { openPanel, closePanel } = useOverlay();
  return { openPanel, closePanel };
}
