import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { GoldButton } from '@/components/common/GoldButton';
import { MemberContribute } from '@/components/common/MemberContribute';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import {
  WorshipBack,
  WorshipCard,
  WorshipEmpty,
  WorshipHeader,
  WorshipPrompt,
  WorshipSection,
} from '@/components/worship/WorshipChrome';
import { WorshipOccasionModal } from '@/components/worship/WorshipEditors';
import { useAppContext } from '@/context/AppContext';
import { FamilyPalette, FamilyTypography } from '@/constants/familyTheme';
import type { WorshipOccasion } from '@/types';
import { formatMonthDay, formatRecordDate } from '@/utils/date';

export function WorshipDatesScreen() {
  const router = useRouter();
  const { worshipOccasions, worshipAddresses } = useAppContext();
  const [adding, setAdding] = useState(false);
  const [editingRow, setEditingRow] = useState<WorshipOccasion | null>(null);
  const occasions = [...worshipOccasions].sort((a, b) => a.monthDay.localeCompare(b.monthDay));

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader
          eyebrow="每年日期 · Yearly Dates"
          title="Each year"
          subtitle="Gregorian month and day. Use the note for the lunar date (農曆). Any member can add or edit one."
        />
        <MemberContribute
          hint="Name the occasion, set the month and day, and add a lunar note if you have it."
          label="Add info · 加入"
          onPress={() => setAdding(true)}
        />
        {occasions.length === 0 ? (
          <WorshipEmpty text="No yearly dates yet." />
        ) : (
          occasions.map((occasion) => {
            const place = worshipAddresses.find((item) => item.id === occasion.addressId);
            return (
              <WorshipCard
                key={occasion.id}
                kicker={`Every year · ${formatMonthDay(occasion.monthDay)}`}
                title={occasion.name}
                detail={[occasion.note, place?.name].filter(Boolean).join(' · ')}
                onPress={() => router.push(`/worship/date/${occasion.id}`)}
                actionLabel="Edit info · 修改"
                onAction={() => setEditingRow(occasion)}
              />
            );
          })
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <WorshipOccasionModal
        visible={adding || editingRow != null}
        occasion={editingRow}
        onClose={() => {
          setAdding(false);
          setEditingRow(null);
        }}
      />
    </View>
  );
}

export function WorshipDateDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { worshipOccasions, worshipAddresses, worshipRecords, deleteWorshipOccasion } = useAppContext();
  const [editing, setEditing] = useState(false);
  const occasion = worshipOccasions.find((item) => item.id === id);
  const place = worshipAddresses.find((item) => item.id === occasion?.addressId);
  const related = worshipRecords
    .filter((record) => record.occasionId === id)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!occasion) {
    return (
      <ScreenContainer>
        <Text style={styles.missing}>This date is no longer here.</Text>
        <GoldButton label="Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Remove date', `Remove “${occasion.name}”? Records stay, without this link.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteWorshipOccasion(occasion.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader eyebrow="每年日期 · Yearly Date" title={occasion.name} />
        <Text style={styles.meta}>Every year · {formatMonthDay(occasion.monthDay)}</Text>
        <MemberContribute
          hint="Any household member can update this date, note, or place."
          label="Edit info · 修改"
          onPress={() => setEditing(true)}
        />
        <Text style={styles.body}>{occasion.note || 'No lunar or other note yet. Add one with Edit info.'}</Text>
        <WorshipSection>
          <Text style={styles.group}>Address</Text>
          {place ? (
            <WorshipCard
              title={place.name}
              detail={place.address}
              onPress={() => router.push(`/worship/address/${place.id}`)}
            />
          ) : (
            <WorshipPrompt label="Not linked yet" onPress={() => setEditing(true)} />
          )}
        </WorshipSection>
        {related.length > 0 ? (
          <WorshipSection>
            <Text style={styles.group}>Records</Text>
            {related.map((record) => (
              <WorshipCard
                key={record.id}
                kicker={formatRecordDate(record.date)}
                title={record.what}
                detail={record.notes}
                onPress={() => router.push(`/worship/record/${record.id}`)}
              />
            ))}
          </WorshipSection>
        ) : null}
        <View style={styles.actions}>
          <GoldButton label="Remove" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>
      <WorshipOccasionModal visible={editing} occasion={occasion} onClose={() => setEditing(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  meta: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  body: {
    ...FamilyTypography.body,
    marginBottom: 24,
  },
  group: {
    ...FamilyTypography.label,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  missing: {
    ...FamilyTypography.body,
    marginBottom: 16,
  },
});
