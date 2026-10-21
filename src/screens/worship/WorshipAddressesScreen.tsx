import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { GoldButton } from '@/components/common/GoldButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import {
  WorshipBack,
  WorshipCard,
  WorshipEmpty,
  WorshipHeader,
  WorshipSection,
} from '@/components/worship/WorshipChrome';
import { WorshipAddressModal } from '@/components/worship/WorshipEditors';
import { useAppContext } from '@/context/AppContext';
import { FamilyTypography } from '@/constants/familyTheme';
import { formatMonthDay, formatRecordDate } from '@/utils/date';

export function WorshipAddressesScreen() {
  const router = useRouter();
  const { worshipAddresses } = useAppContext();
  const [adding, setAdding] = useState(false);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader
          eyebrow="地址 · Addresses"
          title="Where we go"
          subtitle="Places linked from records and yearly dates."
        />
        {worshipAddresses.length === 0 ? (
          <WorshipEmpty text="No addresses yet. Tap + to add a place." />
        ) : (
          worshipAddresses.map((place) => (
            <WorshipCard
              key={place.id}
              title={place.name}
              detail={place.address}
              onPress={() => router.push(`/worship/address/${place.id}`)}
            />
          ))
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <WorshipAddressModal visible={adding} onClose={() => setAdding(false)} />
    </View>
  );
}

export function WorshipAddressDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    worshipAddresses,
    worshipOccasions,
    worshipRecords,
    deleteWorshipAddress,
  } = useAppContext();
  const [editing, setEditing] = useState(false);
  const place = worshipAddresses.find((item) => item.id === id);
  const occasions = worshipOccasions.filter((item) => item.addressId === id);
  const records = worshipRecords
    .filter((item) => item.addressId === id)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!place) {
    return (
      <ScreenContainer>
        <Text style={styles.missing}>This address is no longer here.</Text>
        <GoldButton label="Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Remove address', `Remove “${place.name}”? Linked records and dates stay, without this place.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteWorshipAddress(place.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader eyebrow="地址 · Address" title={place.name} subtitle={place.address} />
        {place.note ? <Text style={styles.body}>{place.note}</Text> : null}
        {occasions.length > 0 ? (
          <WorshipSection>
            <Text style={styles.group}>Yearly dates</Text>
            {occasions.map((occasion) => (
              <WorshipCard
                key={occasion.id}
                kicker={`Every year · ${formatMonthDay(occasion.monthDay)}`}
                title={occasion.name}
                onPress={() => router.push(`/worship/date/${occasion.id}`)}
              />
            ))}
          </WorshipSection>
        ) : null}
        {records.length > 0 ? (
          <WorshipSection>
            <Text style={styles.group}>Records</Text>
            {records.map((record) => (
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
          <GoldButton label="Edit" onPress={() => setEditing(true)} />
          <GoldButton label="Remove" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>
      <WorshipAddressModal visible={editing} address={place} onClose={() => setEditing(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: {
    ...FamilyTypography.body,
    marginTop: -8,
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
