import { Redirect } from 'expo-router';

/** `/sidebar/home` lands on the main home page. */
export default function HomeIndex() {
  return <Redirect href="/sidebar/home/main" />;
}
