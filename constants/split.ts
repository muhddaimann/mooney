/**
 * Bill-split model
 * ----------------
 * Pure types + calculation helpers for the bill-split feature. No React here —
 * this is the testable core that both the SplitProvider (state) and the
 * useGroupBalances hook (derived data) build on.
 */

/** How an expense is divided. Only equal split for now; extensible later. */
export type SplitMethod = 'equal';

export type GroupMember = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title: string;
  /** Total amount of the bill. */
  amount: number;
  /** Member who paid the bill. */
  paidByMemberId: string;
  method: SplitMethod;
  /** Members the bill is split between (defaults to all members). */
  participantIds: string[];
  createdAt: number;
};

export type SplitGroup = {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  expenses: Expense[];
  createdAt: number;
};

/** Per-member tally: what they paid, what they owe, and the net of the two. */
export type MemberBalance = {
  memberId: string;
  paid: number;
  owed: number;
  /** Positive => is owed money. Negative => owes money. */
  net: number;
};

/** A suggested transfer to settle the group. */
export type Settlement = {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Collision-resistant id for client-created entities. */
export const createId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const formatCurrency = (n: number): string => `$${n.toFixed(2)}`;

const roundCents = (n: number): number => Math.round(n * 100) / 100;

/** Lookup a member's display name, falling back gracefully. */
export const memberName = (group: SplitGroup, memberId: string): string =>
  group.members.find((m) => m.id === memberId)?.name ?? 'Unknown';

/** Per-member paid / owed / net for the whole group. */
export const computeBalances = (group: SplitGroup): MemberBalance[] => {
  const paid = new Map<string, number>();
  const owed = new Map<string, number>();
  group.members.forEach((m) => {
    paid.set(m.id, 0);
    owed.set(m.id, 0);
  });

  group.expenses.forEach((e) => {
    paid.set(e.paidByMemberId, (paid.get(e.paidByMemberId) ?? 0) + e.amount);
    const parts = e.participantIds.length
      ? e.participantIds
      : group.members.map((m) => m.id);
    if (parts.length === 0) return;
    const share = e.amount / parts.length;
    parts.forEach((pid) => owed.set(pid, (owed.get(pid) ?? 0) + share));
  });

  return group.members.map((m) => {
    const p = roundCents(paid.get(m.id) ?? 0);
    const o = roundCents(owed.get(m.id) ?? 0);
    return { memberId: m.id, paid: p, owed: o, net: roundCents(p - o) };
  });
};

/**
 * Greedy minimal-transfer settlement: repeatedly match the biggest debtor with
 * the biggest creditor until everyone is square.
 */
export const computeSettlements = (group: SplitGroup): Settlement[] => {
  const EPS = 0.005;
  const debtors = computeBalances(group)
    .filter((b) => b.net < -EPS)
    .map((b) => ({ memberId: b.memberId, net: b.net }))
    .sort((a, b) => a.net - b.net);
  const creditors = computeBalances(group)
    .filter((b) => b.net > EPS)
    .map((b) => ({ memberId: b.memberId, net: b.net }))
    .sort((a, b) => b.net - a.net);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = roundCents(Math.min(-debtor.net, creditor.net));
    if (amount > 0) {
      settlements.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount,
      });
      debtor.net = roundCents(debtor.net + amount);
      creditor.net = roundCents(creditor.net - amount);
    }
    if (Math.abs(debtor.net) < EPS) i++;
    if (Math.abs(creditor.net) < EPS) j++;
  }
  return settlements;
};

export const groupTotal = (group: SplitGroup): number =>
  roundCents(group.expenses.reduce((sum, e) => sum + e.amount, 0));
