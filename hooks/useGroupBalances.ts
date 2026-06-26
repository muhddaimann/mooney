import { useMemo } from 'react';
import {
  computeBalances,
  computeSettlements,
  groupTotal,
  type MemberBalance,
  type Settlement,
  type SplitGroup,
} from '../constants/split';

export type GroupBalances = {
  balances: MemberBalance[];
  settlements: Settlement[];
  total: number;
};

/**
 * Derives the balances, suggested settlements and total for a group. Pure and
 * memoized — recomputes only when the group reference changes.
 */
export const useGroupBalances = (group?: SplitGroup): GroupBalances =>
  useMemo(() => {
    if (!group) return { balances: [], settlements: [], total: 0 };
    return {
      balances: computeBalances(group),
      settlements: computeSettlements(group),
      total: groupTotal(group),
    };
  }, [group]);
