import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../../contexts/authContext';

/** Bill split is admin-only. Non-admins are sent back to Home. */
export default function SplitLayout() {
  const { isAdmin, isHydrated } = useAuth();

  if (!isHydrated) return null;
  if (!isAdmin) return <Redirect href="/sidebar/home/main" />;

  return <Slot />;
}
