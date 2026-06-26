/**
 * Local persistence layer.
 * -----------------------
 * A thin, typed wrapper over AsyncStorage. AsyncStorage transparently uses
 * `localStorage` on web and native key/value stores on iOS/Android, so the same
 * API works everywhere this app runs.
 *
 * All reads/writes are namespaced and fail soft — storage errors never crash
 * the UI, they just resolve to the provided fallback.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = 'mooney';

/** Centralised registry of every persisted key. */
export const StorageKeys = {
  themePreference: `${NAMESPACE}:theme-preference`,
  session: `${NAMESPACE}:session`,
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/** Read and JSON-parse a value, returning `fallback` on miss or error. */
export async function getItem<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** JSON-stringify and persist a value. Swallows errors. */
export async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persisting is best-effort; ignore quota / availability errors.
  }
}

/** Remove a persisted value. Swallows errors. */
export async function removeItem(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
