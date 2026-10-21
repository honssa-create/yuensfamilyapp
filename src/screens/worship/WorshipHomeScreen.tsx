import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { WorshipCard, WorshipHeader } from '@/components/worship/WorshipChrome';
import { useAppContext } from '@/context/AppContext';
import { FamilySpacing, FamilyTypography } from '@/constants/familyTheme';

export function WorshipHomeScreen() {
  const router = useRouter();
  const { worshipRecords, worshipGuides, worshipOccasions, worshipAddresses } = useAppContext();

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipHeader
          eyebrow="祭祀 · Ancestral Worship"
          title="Remembrance"
          subtitle="Dates, places, and the notes we keep for those who came before."
        />

        <WorshipCard
          kicker="祭祀紀錄 · Records"
          title="What we have done"
          detail={`${worshipRecords.length} recorded`}
          onPress={() => router.push('/worship/records')}
        />
        <WorshipCard
          kicker="祭祀指引 · Guides"
          title="How the family observes"
          detail={`${worshipGuides.length} notes`}
          onPress={() => router.push('/worship/guides')}
        />
        <WorshipCard
          kicker="每年日期 · Yearly Dates"
          title="Occasions that return"
          detail={`${worshipOccasions.length} each year`}
          onPress={() => router.push('/worship/dates')}
        />
        <WorshipCard
          kicker="地址 · Addresses"
          title="Where we go"
          detail={`${worshipAddresses.length} places`}
          onPress={() => router.push('/worship/addresses')}
        />

        <Text style={styles.footnote}>
          Yearly dates use the Gregorian calendar. Lunar dates (農曆) live in the note.
        </Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  footnote: {
    ...FamilyTypography.caption,
    marginTop: FamilySpacing.sm,
  },
});
