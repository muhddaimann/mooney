import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

const STORAGE_PREFIX = 'mooney:';

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export type LocalApi = {
  /** Read and JSON-parse a stored value, or `null` if absent/invalid/unavailable. */
  getItem: <T>(key: string) => T | null;
  /** JSON-stringify and persist a value under `key`. */
  setItem: <T>(key: string, value: T) => void;
  /** Remove a stored value. */
  removeItem: (key: string) => void;
};

const LocalContext = createContext<LocalApi | undefined>(undefined);

/**
 * Thin, typed wrapper over `localStorage` so the rest of the app never talks
 * to `window.localStorage` directly. Backs local-only features (like the
 * WhoAmI profile in `authContext`) that persist data without an account or
 * backend.
 */
export function LocalProvider({ children }: { children: ReactNode }) {
  const getItem = useCallback(<T,>(key: string): T | null => {
    if (!hasLocalStorage()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }, []);

  const setItem = useCallback(<T,>(key: string, value: T) => {
    if (!hasLocalStorage()) return;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage full/unavailable (e.g. private browsing) - fail silently.
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    if (!hasLocalStorage()) return;
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LocalApi>(
    () => ({ getItem, setItem, removeItem }),
    [getItem, setItem, removeItem],
  );

  return <LocalContext.Provider value={value}>{children}</LocalContext.Provider>;
}

/** Access the local key/value storage API. */
export function useLocal(): LocalApi {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error('useLocal must be used within a LocalProvider');
  }
  return context;
}
