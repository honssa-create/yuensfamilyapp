import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { WorshipCard, WorshipHeader } from '@/components/worship/WorshipChrome';
import {
  WorshipAddressModal,
  WorshipGuideModal,
  WorshipOccasionModal,
  WorshipRecordModal,
} from '@/components/worship/WorshipEditors';
import { useAppContext } from '@/context/AppContext';
import { FamilySpacing, FamilyTypography } from '@/constants/familyTheme';

type AddKind = 'record' | 'guide' | 'date' | 'address' | null;

export function WorshipHomeScreen() {
  const router = useRouter();
  const { worshipRecords, worshipGuides, worshipOccasions, worshipAddresses } = useAppContext();
  const [adding, setAdding] = useState<AddKind>(null);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipHeader
          eyebrow="祭祀 · Ancestral Worship"
          title="Remembrance"
          subtitle="Any household member can add or update a record, guide, yearly date, or address."
        />

        <WorshipCard
          kicker="祭祀紀錄 · Records"
          title="What we have done"
          detail={`${worshipRecords.length} recorded`}
          onPress={() => router.push('/worship/records')}
          actionLabel="Add info · 加入"
          onAction={() => setAdding('record')}
        />
        <WorshipCard
          kicker="祭祀指引 · Guides"
          title="How the family observes"
          detail={`${worshipGuides.length} notes`}
          onPress={() => router.push('/worship/guides')}
          actionLabel="Add info · 加入"
          onAction={() => setAdding('guide')}
        />
        <WorshipCard
          kicker="每年日期 · Yearly Dates"
          title="Occasions that return"
          detail={`${worshipOccasions.length} each year`}
          onPress={() => router.push('/worship/dates')}
          actionLabel="Add info · 加入"
          onAction={() => setAdding('date')}
        />
        <WorshipCard
          kicker="地址 · Addresses"
          title="Where we go"
          detail={`${worshipAddresses.length} places`}
          onPress={() => router.push('/worship/addresses')}
          actionLabel="Add info · 加入"
          onAction={() => setAdding('address')}
        />

        <Text style={styles.footnote}>
          Yearly dates use the Gregorian calendar. Lunar dates (農曆) live in the note.
        </Text>
      </ScreenContainer>
      <WorshipRecordModal visible={adding === 'record'} onClose={() => setAdding(null)} />
      <WorshipGuideModal visible={adding === 'guide'} onClose={() => setAdding(null)} />
      <WorshipOccasionModal visible={adding === 'date'} onClose={() => setAdding(null)} />
      <WorshipAddressModal visible={adding === 'address'} onClose={() => setAdding(null)} />
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
