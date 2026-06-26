import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  createId,
  type Expense,
  type SplitGroup,
} from '../constants/split';

/** Payload for creating an expense; shares are derived from the method. */
export type ExpenseInput = {
  title: string;
  amount: number;
  paidByMemberId: string;
  /** Defaults to every current member (equal split). */
  participantIds?: string[];
};

type SplitContextValue = {
  groups: SplitGroup[];
  getGroup: (id: string) => SplitGroup | undefined;
  createGroup: (name: string, description?: string) => SplitGroup;
  deleteGroup: (id: string) => void;
  addMember: (groupId: string, name: string) => void;
  removeMember: (groupId: string, memberId: string) => void;
  addExpense: (groupId: string, input: ExpenseInput) => void;
  removeExpense: (groupId: string, expenseId: string) => void;
};

const SplitContext = createContext<SplitContextValue | null>(null);

export const SplitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory for now — starts empty so the full create-from-scratch flow is
  // visible. Swap to the persistence layer (tokenContext) when ready.
  const [groups, setGroups] = useState<SplitGroup[]>([]);

  const getGroup = useCallback(
    (id: string) => groups.find((g) => g.id === id),
    [groups],
  );

  /** Apply an update to a single group by id, leaving the rest untouched. */
  const updateGroup = useCallback(
    (groupId: string, updater: (group: SplitGroup) => SplitGroup) => {
      setGroups((prev) => prev.map((g) => (g.id === groupId ? updater(g) : g)));
    },
    [],
  );

  const createGroup = useCallback((name: string, description?: string) => {
    const group: SplitGroup = {
      id: createId('grp'),
      name: name.trim(),
      description: description?.trim() || undefined,
      members: [],
      expenses: [],
      createdAt: Date.now(),
    };
    setGroups((prev) => [group, ...prev]);
    return group;
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addMember = useCallback(
    (groupId: string, name: string) => {
      updateGroup(groupId, (g) => ({
        ...g,
        members: [...g.members, { id: createId('mbr'), name: name.trim() }],
      }));
    },
    [updateGroup],
  );

  const removeMember = useCallback(
    (groupId: string, memberId: string) => {
      updateGroup(groupId, (g) => ({
        ...g,
        members: g.members.filter((m) => m.id !== memberId),
        // Drop expenses that depended on the removed member to keep math sound.
        expenses: g.expenses.filter(
          (e) => e.paidByMemberId !== memberId && !e.participantIds.includes(memberId),
        ),
      }));
    },
    [updateGroup],
  );

  const addExpense = useCallback(
    (groupId: string, input: ExpenseInput) => {
      updateGroup(groupId, (g) => {
        const participantIds =
          input.participantIds && input.participantIds.length > 0
            ? input.participantIds
            : g.members.map((m) => m.id);
        const expense: Expense = {
          id: createId('exp'),
          title: input.title.trim(),
          amount: input.amount,
          paidByMemberId: input.paidByMemberId,
          method: 'equal',
          participantIds,
          createdAt: Date.now(),
        };
        return { ...g, expenses: [expense, ...g.expenses] };
      });
    },
    [updateGroup],
  );

  const removeExpense = useCallback(
    (groupId: string, expenseId: string) => {
      updateGroup(groupId, (g) => ({
        ...g,
        expenses: g.expenses.filter((e) => e.id !== expenseId),
      }));
    },
    [updateGroup],
  );

  const value = useMemo<SplitContextValue>(
    () => ({
      groups,
      getGroup,
      createGroup,
      deleteGroup,
      addMember,
      removeMember,
      addExpense,
      removeExpense,
    }),
    [groups, getGroup, createGroup, deleteGroup, addMember, removeMember, addExpense, removeExpense],
  );

  return <SplitContext.Provider value={value}>{children}</SplitContext.Provider>;
};

export const useSplit = (): SplitContextValue => {
  const ctx = useContext(SplitContext);
  if (!ctx) {
    throw new Error('useSplit must be used within a <SplitProvider>');
  }
  return ctx;
};
