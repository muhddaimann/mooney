import { Slot } from 'expo-router';

/** Bill split is available to all signed-in users (auth is enforced by the parent layout). */
export default function SplitLayout() {
  return <Slot />;
}
