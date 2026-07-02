import { useEffect, useRef } from 'react';

import { WhoAmIForm } from '@/components/auth/whoAmIForm';
import { useAuth, type WhoAmI } from '@/contexts/authContext';
import { useThemeMode } from '@/contexts/themeContext';
import { useLoader } from '@/hooks/useLoader';
import { useOverlay } from '@/hooks/useOverlay';

/**
 * Access the local WhoAmI profile state (nickname + emoji avatar, no
 * account). Pure state - re-exported here for the conventional hooks/
 * location. The hooks below (`useNewUser`, `useSignOut`, `useAuthGate`)
 * handle the actual create/edit/sign-out/app-open processes on top of it.
 *
 * @example
 * const { profile, hasProfile, setProfile } = useAuth();
 * if (!hasProfile) setProfile({ name: 'Ada', emoji: '🦄' });
 */
export { useAuth };
export type { WhoAmI };

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type PromptOptions = {
  /** Pre-fills the form for editing an existing profile instead of creating a new one. */
  initial?: WhoAmI;
  /** Allow backdrop/close-icon dismissal. Defaults to true; set false to make it mandatory. */
  dismissable?: boolean;
};

/**
 * Prompts for a WhoAmI nickname/emoji via modal and persists it through
 * `useAuth().setProfile`. Covers both first-time setup (no `initial`) and
 * editing an existing profile (`initial` set). Theme isn't asked here - it
 * carries over from the existing profile when editing, or defaults to the
 * current app theme for a brand new one; use `ProfileMenu`'s "Toggle theme"
 * to change it. Raw prompt only, no loader/toast - see `useManageProfile`
 * for the full feedback flow.
 *
 * Resolves to the saved profile, or `null` if the modal was dismissed.
 *
 * @example
 * const promptProfile = useNewUser();
 * await promptProfile();                          // first-time setup
 * await promptProfile({ initial: profile });       // edit
 * await promptProfile({ dismissable: false });     // mandatory, can't cancel
 */
export function useNewUser() {
  const { setProfile } = useAuth();
  const { mode } = useThemeMode();
  const overlay = useOverlay();

  return async ({ initial, dismissable = true }: PromptOptions = {}): Promise<WhoAmI | null> => {
    const result = await overlay.modal<Omit<WhoAmI, 'theme'>>({
      variant: 'form',
      dismissable,
      render: (close) => <WhoAmIForm initial={initial} onSubmit={close} />,
    });
    if (!result) return null;

    const profile: WhoAmI = { ...result, theme: initial?.theme ?? mode };
    setProfile(profile);
    return profile;
  };
}

/**
 * The full "manage profile" flow with user feedback: prompts via
 * `useNewUser` (create or edit), imitates saving behind a loader, then
 * confirms with a toast. Shared by the WhoAmI dashboard card and the profile
 * menu so the copy/timing only lives in one place.
 *
 * @example
 * const manageProfile = useManageProfile();
 * await manageProfile();          // first-time setup
 * await manageProfile(profile);   // edit
 */
export function useManageProfile() {
  const { withLoader } = useLoader();
  const overlay = useOverlay();
  const promptProfile = useNewUser();

  return async (initial?: WhoAmI): Promise<WhoAmI | null> => {
    const result = await promptProfile({ initial });
    if (!result) return null;

    // Purely a perceived-latency beat for the "saving" feel - there's no real
    // network call, the profile is already persisted by the time we get here.
    await withLoader(
      delay(600),
      initial ? 'Saving your profile…' : 'Setting up your profile…',
    );
    overlay.toast({
      variant: 'success',
      message: initial ? 'Profile updated.' : `Welcome, ${result.name}!`,
    });
    return result;
  };
}

/**
 * Confirms, then imitates signing out behind a loader, clears the local
 * WhoAmI profile, and immediately re-opens the mandatory setup modal (see
 * `useNewUser`) - there's no server session to end, so "signing out" just
 * means forgetting the local nickname/avatar and asking for a fresh one,
 * same as the app-open gate.
 *
 * Resolves to whether sign-out actually happened (false if cancelled).
 *
 * @example
 * const signOut = useSignOut();
 * <Button onPress={signOut} />
 */
export function useSignOut() {
  const { clearProfile } = useAuth();
  const { withLoader } = useLoader();
  const overlay = useOverlay();
  const promptProfile = useNewUser();

  return async (): Promise<boolean> => {
    const confirmed = await overlay.confirm({
      title: 'Sign out?',
      message: 'This removes your nickname and avatar from this device.',
      confirmLabel: 'Sign out',
      destructive: true,
    });
    if (!confirmed) return false;

    await withLoader(delay(500), 'Signing out…');
    clearProfile();

    const result = await promptProfile({ dismissable: false });
    if (result) {
      overlay.toast({ variant: 'success', message: `Welcome, ${result.name}!` });
    }
    return true;
  };
}

/**
 * Runs once per app open (guarded so it survives re-renders but not
 * remounts): imitates an authentication check behind a loader, then either
 * greets an existing local profile with a toast, or prompts for one via the
 * mandatory WhoAmI modal (see `useNewUser`).
 *
 * Must be called from a component rendered inside `OverlayProvider` (and
 * `AuthProvider`/`LocalProvider`), e.g. near the app root, so it fires on
 * every app open rather than per screen.
 */
export function useAuthGate() {
  const { profile } = useAuth();
  const { setMode } = useThemeMode();
  const { withLoader } = useLoader();
  const overlay = useOverlay();
  const promptProfile = useNewUser();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      await withLoader(delay(500), 'Authenticating…');

      if (!profile) {
        const result = await promptProfile({ dismissable: false });
        if (!result) return;
        overlay.toast({ variant: 'success', message: `Welcome, ${result.name}!` });
      } else {
        // Restore the saved theme preference - the app otherwise always
        // boots in light mode. Hidden behind the loader above, so no flash.
        setMode(profile.theme);
        overlay.toast({ variant: 'success', message: `Welcome back, ${profile.name}!` });
      }
    })();
  }, []);
}
