import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { type ThemeMode } from '@/constants/theme';
import { useLocal } from '@/contexts/localContext';

const STORAGE_KEY = 'whoami';

/** The local, account-free profile: a nickname, an emoji/icon avatar, and a theme preference. */
export type WhoAmI = {
  name: string;
  emoji: string;
  theme: ThemeMode;
};

type AuthApi = {
  /** The local profile, or `null` if one hasn't been set up yet. */
  profile: WhoAmI | null;
  /** Whether a profile exists - gates onboarding vs. the rest of the app. */
  hasProfile: boolean;
  /** Create or update the local profile. */
  setProfile: (profile: WhoAmI) => void;
  /** Clear the local profile from this device. */
  clearProfile: () => void;
};

const AuthContext = createContext<AuthApi | undefined>(undefined);

/**
 * WhoAmI: a lightweight local profile (nickname + emoji avatar) with no
 * account or backend. Persisted through `localContext` so it survives
 * reloads.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const local = useLocal();
  const [profile, setProfileState] = useState<WhoAmI | null>(() =>
    local.getItem<WhoAmI>(STORAGE_KEY),
  );

  const setProfile = useCallback(
    (next: WhoAmI) => {
      local.setItem(STORAGE_KEY, next);
      setProfileState(next);
    },
    [local],
  );

  const clearProfile = useCallback(() => {
    local.removeItem(STORAGE_KEY);
    setProfileState(null);
  }, [local]);

  const value = useMemo<AuthApi>(
    () => ({ profile, hasProfile: profile !== null, setProfile, clearProfile }),
    [profile, setProfile, clearProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the local WhoAmI profile API. */
export function useAuth(): AuthApi {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
