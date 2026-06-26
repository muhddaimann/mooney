import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEMO_USERS,
  Roles,
  roleHasPermission,
  type AuthUser,
  type Permission,
  type Role,
} from '../constants/auth';
import { StorageKeys, getItem, removeItem, setItem } from './tokenContext';

type AuthContextValue = {
  /** The signed-in user, or `null` when unauthenticated. */
  user: AuthUser | null;
  /** Convenience accessor for the current user's role. */
  role: Role | null;
  isAuthenticated: boolean;
  /** Whether the persisted session has been read from storage yet. */
  isHydrated: boolean;
  /** Sign in with a specific user object (e.g. from a real backend). */
  signIn: (user: AuthUser) => Promise<void>;
  /** Sign in as one of the built-in demo accounts for a role. */
  signInAs: (role: Role) => Promise<void>;
  signOut: () => Promise<void>;
  /** True if the current user's role is one of the given roles. */
  hasRole: (...roles: Role[]) => boolean;
  isAdmin: boolean;
  /** True if the current user's role grants the given permission. */
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore a persisted session once on mount.
  useEffect(() => {
    let active = true;
    getItem<AuthUser | null>(StorageKeys.session, null).then((stored) => {
      if (active) {
        setUser(stored);
        setIsHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (next: AuthUser) => {
    setUser(next);
    await setItem(StorageKeys.session, next);
  }, []);

  const signInAs = useCallback(
    (role: Role) => signIn(DEMO_USERS[role]),
    [signIn],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    await removeItem(StorageKeys.session);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => (user ? roles.includes(user.role) : false),
    [user],
  );

  const can = useCallback(
    (permission: Permission) => (user ? roleHasPermission(user.role, permission) : false),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: user !== null,
      isHydrated,
      signIn,
      signInAs,
      signOut,
      hasRole,
      isAdmin: user?.role === Roles.ADMIN,
      can,
    }),
    [user, isHydrated, signIn, signInAs, signOut, hasRole, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
};
