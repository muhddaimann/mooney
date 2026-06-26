import { useMemo } from 'react';
import {
  computeOrder,
  type MenuCharge,
  type MenuItem,
  type PaymentSummary,
} from '../constants/menu';
import { useMenu } from '../contexts/menuContext';

export type OrderTotals = {
  items: MenuItem[];
  charges: MenuCharge[];
  summary: PaymentSummary;
};

/**
 * Derives priced items, charges and the payment summary from the current menu
 * selection. Pure + memoized — recomputes only when the selection changes.
 */
export const useOrderTotals = (): OrderTotals => {
  const { lines } = useMenu();
  return useMemo(() => computeOrder(lines), [lines]);
};
