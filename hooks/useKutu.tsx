import { GroupForm } from '@/components/kutu/groupForm';
import { MemberForm } from '@/components/kutu/memberForm';
import { KUTU_SEED } from '@/constants/seed';
import {
  useKutu,
  type KutuGroup,
} from '@/contexts/kutuContext';
import { useLoader } from '@/hooks/useLoader';
import { useOverlay } from '@/hooks/useOverlay';

/**
 * Access the local kutu groups state. Pure state - re-exported here for the
 * conventional hooks/ location. The hooks below handle the actual
 * create-group/add-member/record-contribution processes on top of it.
 */
export { useKutu };
export type { KutuGroup, KutuMember, KutuContribution } from '@/contexts/kutuContext';
export {
  getCurrentRecipient,
  getPendingMembers,
  getRecipientForRound,
  getMonthLabelForRound,
} from '@/contexts/kutuContext';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Prompts for a new group's name, contribution amount, and planned member
 * count via modal, imitates saving behind a loader, then persists it through
 * `useKutu().addGroup`.
 *
 * Resolves to the created group, or `null` if the modal was dismissed.
 *
 * @example
 * const createGroup = useCreateGroup();
 * const group = await createGroup();
 * if (group) router.push(`/kutu/${group.id}`);
 */
export function useCreateGroup() {
  const { addGroup } = useKutu();
  const { withLoader } = useLoader();
  const overlay = useOverlay();

  return async (): Promise<KutuGroup | null> => {
    const result = await overlay.modal<{
      name: string;
      contributionAmount: number;
      totalMembers: number;
    }>({
      variant: 'form',
      render: (close) => <GroupForm onSubmit={close} />,
    });
    if (!result) return null;

    await withLoader(delay(500), 'Creating group…');
    const group = addGroup(result);
    overlay.toast({ variant: 'success', message: `${group.name} created.` });
    return group;
  };
}

/**
 * Prompts for a new member's name + emoji via modal, imitates saving behind
 * a loader, then persists it onto the given group through
 * `useKutu().addMember`.
 *
 * @example
 * const addMember = useAddMember();
 * await addMember(group.id);
 */
export function useAddMember() {
  const { addMember } = useKutu();
  const { withLoader } = useLoader();
  const overlay = useOverlay();

  return async (groupId: string): Promise<boolean> => {
    const result = await overlay.modal<{ name: string; emoji: string }>({
      variant: 'form',
      render: (close) => <MemberForm onSubmit={close} />,
    });
    if (!result) return false;

    await withLoader(delay(400), 'Adding member…');
    addMember(groupId, result);
    overlay.toast({ variant: 'success', message: `${result.name} added.` });
    return true;
  };
}

/**
 * Imitates recording a contribution behind a loader, then persists it
 * through `useKutu().recordContribution`. No modal - the `/kutu/add` page
 * collects the member/amount itself and calls this on submit.
 *
 * @example
 * const recordContribution = useRecordContribution();
 * await recordContribution(groupId, { memberId, amount });
 */
export function useRecordContribution() {
  const { recordContribution } = useKutu();
  const { withLoader } = useLoader();
  const overlay = useOverlay();

  return async (groupId: string, input: { memberId: string; amount: number }): Promise<void> => {
    await withLoader(delay(400), 'Recording contribution…');
    recordContribution(groupId, input);
    overlay.toast({ variant: 'success', message: 'Contribution recorded.' });
  };
}

/**
 * Imitates loading a demo group (`constants/seed.ts`'s BebyLens Group, 10
 * members, 3 completed rounds) behind a loader, then persists it through
 * `useKutu().addSeedGroup`. Built atomically rather than by chaining
 * addMember/recordContribution, since those close over the last-rendered
 * `groups` value and would clobber each other if called back-to-back
 * synchronously.
 *
 * @example
 * const loadSampleData = useLoadSampleData();
 * const group = await loadSampleData();
 * if (group) router.push(`/kutu/${group.id}`);
 */
export function useLoadSampleData() {
  const { addSeedGroup } = useKutu();
  const { withLoader } = useLoader();
  const overlay = useOverlay();

  return async (): Promise<KutuGroup> => {
    await withLoader(delay(600), 'Loading sample data…');
    const group = addSeedGroup({
      name: KUTU_SEED.groupName,
      contributionAmount: KUTU_SEED.contributionAmount,
      members: [...KUTU_SEED.members],
      completedRounds: KUTU_SEED.completedRounds,
    });
    overlay.toast({ variant: 'success', message: `${group.name} loaded.` });
    return group;
  };
}

/**
 * Imitates clearing every group behind a loader, then persists it through
 * `useKutu().clearGroups`. No confirmation here - `ModuleMenu` (the caller)
 * already confirms before invoking this.
 *
 * @example
 * const clearAllGroups = useClearAllGroups();
 * await clearAllGroups();
 */
export function useClearAllGroups() {
  const { clearGroups } = useKutu();
  const { withLoader } = useLoader();
  const overlay = useOverlay();

  return async (): Promise<void> => {
    await withLoader(delay(400), 'Clearing groups…');
    clearGroups();
    overlay.toast({ variant: 'info', message: 'All groups cleared.' });
  };
}
