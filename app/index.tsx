import { Redirect } from 'expo-router';

/** App entry — route straight into the main app shell. */
export default function Index() {
  return <Redirect href="/sidebar/home/main" />;
}
