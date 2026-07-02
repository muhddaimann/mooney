import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileMenu } from '@/components/auth/profileMenu';
import { WhoAmICard } from '@/components/auth/whoAmICard';
import { ChangelogSection } from '@/components/changelogSection';
import { FinanceModulesSection } from '@/components/financeModulesSection';
import { Header } from '@/components/shared/header';
import { about } from '@/constants/about';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HomeScreen() {
  const { styles, tokens } = useAppTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: tokens.spacing.lg }}
      >
        <View style={{ gap: tokens.spacing.xl }}>
          <Header title={about.brand} subtitle={about.tagline} right={<ProfileMenu />} />

          <WhoAmICard />

          <FinanceModulesSection />

          <ChangelogSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
