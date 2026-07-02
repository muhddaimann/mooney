/**
 * Centralized, typed access to public environment variables.
 * Only EXPO_PUBLIC_* vars are available in the client bundle.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
} as const;
