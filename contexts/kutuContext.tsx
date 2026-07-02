import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { useLocal } from '@/contexts/localContext';

const STORAGE_KEY = 'kutu-groups';

const uid = () => Math.random().toString(36).slice(2, 10);

export type KutuMember = {
  id: string;
  name: string;
  emoji: string;
};

export type KutuContribution = {
  id: string;
  memberId: string;
  round: number;
  amount: number;
  paidAt: string;
};

export type KutuGroup = {
  id: string;
  name: string;
  contributionAmount: number;
  /** Planned number of participants, set at creation - separate from how many have actually been named so far. */
  totalMembers: number;
  members: KutuMember[];
  /** Member ids in payout order; index 0 receives round 1's pool, index 1 round 2's, etc. */
  payoutOrder: string[];
  currentRound: number;
  contributions: KutuContribution[];
  /** When the group's first cycle started - rounds are labeled by calendar month from here. */
  startedAt: string;
  createdAt: string;
};

type KutuApi = {
  groups: KutuGroup[];
  addGroup: (input: {
    name: string;
    contributionAmount: number;
    totalMembers: number;
  }) => KutuGroup;
  addMember: (groupId: string, input: { name: string; emoji: string }) => void;
  recordContribution: (groupId: string, input: { memberId: string; amount: number }) => void;
  /** Builds a fully-formed demo group (members + completed rounds) in one shot. */
  addSeedGroup: (input: {
    name: string;
    contributionAmount: number;
    members: { name: string; emoji: string }[];
    completedRounds: number;
  }) => KutuGroup;
  clearGroups: () => void;
};

const KutuContext = createContext<KutuApi | undefined>(undefined);

/**
 * Kutu (rotating savings group): a group of members who each contribute a
 * fixed amount every round, with one member receiving the pooled total per
 * round in turn. Persisted through `localContext`, no account or backend.
 */
export function KutuProvider({ children }: { children: ReactNode }) {
  const local = useLocal();
  const [groups, setGroups] = useState<KutuGroup[]>(
    () => local.getItem<KutuGroup[]>(STORAGE_KEY) ?? [],
  );

  const persist = useCallback(
    (next: KutuGroup[]) => {
      local.setItem(STORAGE_KEY, next);
      setGroups(next);
    },
    [local],
  );

  const addGroup = useCallback(
    (input: { name: string; contributionAmount: number; totalMembers: number }): KutuGroup => {
      const now = new Date().toISOString();
      const group: KutuGroup = {
        id: uid(),
        name: input.name,
        contributionAmount: input.contributionAmount,
        totalMembers: input.totalMembers,
        members: [],
        payoutOrder: [],
        currentRound: 1,
        contributions: [],
        startedAt: now,
        createdAt: now,
      };
      persist([...groups, group]);
      return group;
    },
    [groups, persist],
  );

  const addMember = useCallback(
    (groupId: string, input: { name: string; emoji: string }) => {
      const member: KutuMember = { id: uid(), ...input };
      persist(
        groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                members: [...group.members, member],
                payoutOrder: [...group.payoutOrder, member.id],
              }
            : group,
        ),
      );
    },
    [groups, persist],
  );

  const recordContribution = useCallback(
    (groupId: string, input: { memberId: string; amount: number }) => {
      persist(
        groups.map((group) => {
          if (group.id !== groupId) return group;

          const contribution: KutuContribution = {
            id: uid(),
            round: group.currentRound,
            paidAt: new Date().toISOString(),
            ...input,
          };
          const contributions = [...group.contributions, contribution];

          // Advance to the next round once every member has paid this one.
          const paidThisRound = new Set(
            contributions
              .filter((entry) => entry.round === group.currentRound)
              .map((entry) => entry.memberId),
          );
          const roundComplete =
            group.members.length > 0 && group.members.every((member) => paidThisRound.has(member.id));

          return {
            ...group,
            contributions,
            currentRound: roundComplete ? group.currentRound + 1 : group.currentRound,
          };
        }),
      );
    },
    [groups, persist],
  );

  const addSeedGroup = useCallback(
    (input: {
      name: string;
      contributionAmount: number;
      members: { name: string; emoji: string }[];
      completedRounds: number;
    }): KutuGroup => {
      const now = new Date().toISOString();
      const members: KutuMember[] = input.members.map((member) => ({ id: uid(), ...member }));

      const contributions: KutuContribution[] = [];
      for (let round = 1; round <= input.completedRounds; round += 1) {
        for (const member of members) {
          contributions.push({
            id: uid(),
            memberId: member.id,
            round,
            amount: input.contributionAmount,
            paidAt: now,
          });
        }
      }

      // Backdate the start so the completed rounds land in past months and
      // the in-progress round lands on the current month.
      const startedDate = new Date();
      startedDate.setMonth(startedDate.getMonth() - input.completedRounds);

      const group: KutuGroup = {
        id: uid(),
        name: input.name,
        contributionAmount: input.contributionAmount,
        totalMembers: members.length,
        members,
        payoutOrder: members.map((member) => member.id),
        currentRound: input.completedRounds + 1,
        contributions,
        startedAt: startedDate.toISOString(),
        createdAt: now,
      };
      persist([...groups, group]);
      return group;
    },
    [groups, persist],
  );

  const clearGroups = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo<KutuApi>(
    () => ({ groups, addGroup, addMember, recordContribution, addSeedGroup, clearGroups }),
    [groups, addGroup, addMember, recordContribution, addSeedGroup, clearGroups],
  );

  return <KutuContext.Provider value={value}>{children}</KutuContext.Provider>;
}

/** Access the local kutu groups state. */
export function useKutu(): KutuApi {
  const context = useContext(KutuContext);
  if (!context) {
    throw new Error('useKutu must be used within a KutuProvider');
  }
  return context;
}

/** Cycles run monthly starting from `group.startedAt` - round 1 is that month, round 2 the next, etc. */
export function getMonthLabelForRound(group: KutuGroup, round: number): string {
  const date = new Date(group.startedAt);
  date.setMonth(date.getMonth() + (round - 1));
  return date.toLocaleDateString('en-US', { month: 'long' });
}

/** The member scheduled to receive the given round's payout, if the payout order is set. */
export function getRecipientForRound(group: KutuGroup, round: number): KutuMember | null {
  if (group.payoutOrder.length === 0) return null;
  const recipientId = group.payoutOrder[(round - 1) % group.payoutOrder.length];
  return group.members.find((member) => member.id === recipientId) ?? null;
}

/** The member scheduled to receive the current round's payout, if the payout order is set. */
export function getCurrentRecipient(group: KutuGroup): KutuMember | null {
  return getRecipientForRound(group, group.currentRound);
}

/** Members who still haven't paid for the group's current round. */
export function getPendingMembers(group: KutuGroup): KutuMember[] {
  const paidThisRound = new Set(
    group.contributions
      .filter((entry) => entry.round === group.currentRound)
      .map((entry) => entry.memberId),
  );
  return group.members.filter((member) => !paidThisRound.has(member.id));
}
