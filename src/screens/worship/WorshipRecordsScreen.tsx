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
import { WorshipRecordModal } from '@/components/worship/WorshipEditors';
import { useAppContext } from '@/context/AppContext';
import { FamilyPalette, FamilyTypography } from '@/constants/familyTheme';
import type { WorshipRecord } from '@/types';
import { formatRecordDate } from '@/utils/date';

export function WorshipRecordsScreen() {
  const router = useRouter();
  const { worshipRecords, worshipAddresses, worshipOccasions } = useAppContext();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<WorshipRecord | null>(null);
  const records = [...worshipRecords].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader
          eyebrow="祭祀紀錄 · Records"
          title="What we have done"
          subtitle="A quiet log of visits and offerings. Any member can add or edit one."
        />
        <MemberContribute
          hint="Date, what was done, and notes. Link a yearly date or address if you know it."
          label="Add info · 加入"
          onPress={() => setAdding(true)}
        />
        {records.length === 0 ? (
          <WorshipEmpty text="No records yet." />
        ) : (
          records.map((record) => {
            const place = worshipAddresses.find((item) => item.id === record.addressId);
            const occasion = worshipOccasions.find((item) => item.id === record.occasionId);
            const detail = [occasion?.name, place?.name].filter(Boolean).join(' · ');
            return (
              <WorshipCard
                key={record.id}
                kicker={formatRecordDate(record.date)}
                title={record.what}
                detail={detail || record.notes}
                onPress={() => router.push(`/worship/record/${record.id}`)}
                actionLabel="Edit info · 修改"
                onAction={() => setEditing(record)}
              />
            );
          })
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <WorshipRecordModal
        visible={adding || editing != null}
        record={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
      />
    </View>
  );
}

export function WorshipRecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    worshipRecords,
    worshipAddresses,
    worshipOccasions,
    deleteWorshipRecord,
  } = useAppContext();
  const [editing, setEditing] = useState(false);
  const record = worshipRecords.find((item) => item.id === id);
  const place = worshipAddresses.find((item) => item.id === record?.addressId);
  const occasion = worshipOccasions.find((item) => item.id === record?.occasionId);

  if (!record) {
    return (
      <ScreenContainer>
        <Text style={styles.missing}>This record is no longer here.</Text>
        <GoldButton label="Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Remove record', `Remove “${record.what}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteWorshipRecord(record.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader eyebrow="祭祀紀錄 · Record" title={record.what} />
        <Text style={styles.meta}>{formatRecordDate(record.date)}</Text>
        <MemberContribute
          hint="Any household member can update this record."
          label="Edit info · 修改"
          onPress={() => setEditing(true)}
        />
        <Text style={styles.body}>{record.notes || 'No notes yet. Add them with Edit info.'}</Text>
        <WorshipSection>
          <Text style={styles.group}>Yearly date</Text>
          {occasion ? (
            <WorshipCard
              title={occasion.name}
              detail={occasion.note}
              onPress={() => router.push(`/worship/date/${occasion.id}`)}
            />
          ) : (
            <WorshipPrompt label="Not linked yet" onPress={() => setEditing(true)} />
          )}
        </WorshipSection>
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
        <View style={styles.actions}>
          <GoldButton label="Remove" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>
      <WorshipRecordModal visible={editing} record={record} onClose={() => setEditing(false)} />
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
