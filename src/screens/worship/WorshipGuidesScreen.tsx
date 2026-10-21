import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { GoldButton } from '@/components/common/GoldButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import {
  Checklist,
  WorshipBack,
  WorshipCard,
  WorshipEmpty,
  WorshipHeader,
} from '@/components/worship/WorshipChrome';
import { WorshipGuideModal } from '@/components/worship/WorshipEditors';
import { useAppContext } from '@/context/AppContext';
import { FamilyTypography } from '@/constants/familyTheme';

export function WorshipGuidesScreen() {
  const router = useRouter();
  const { worshipGuides } = useAppContext();
  const [adding, setAdding] = useState(false);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader
          eyebrow="祭祀指引 · Guides"
          title="How we observe"
          subtitle="Editable notes, one step on each line."
        />
        {worshipGuides.length === 0 ? (
          <WorshipEmpty text="No guides yet. Tap + to write the first." />
        ) : (
          worshipGuides.map((guide) => {
            const first = guide.body.split('\n').map((line) => line.trim()).find(Boolean);
            return (
              <WorshipCard
                key={guide.id}
                title={guide.title}
                detail={first}
                onPress={() => router.push(`/worship/guide/${guide.id}`)}
              />
            );
          })
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <WorshipGuideModal visible={adding} onClose={() => setAdding(false)} />
    </View>
  );
}

export function WorshipGuideDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { worshipGuides, deleteWorshipGuide } = useAppContext();
  const [editing, setEditing] = useState(false);
  const guide = worshipGuides.find((item) => item.id === id);

  if (!guide) {
    return (
      <ScreenContainer>
        <Text style={styles.missing}>This guide is no longer here.</Text>
        <GoldButton label="Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Remove guide', `Remove “${guide.title}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteWorshipGuide(guide.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader eyebrow="祭祀指引 · Guide" title={guide.title} />
        <Checklist body={guide.body} />
        <View style={styles.actions}>
          <GoldButton label="Edit" onPress={() => setEditing(true)} />
          <GoldButton label="Remove" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>
      <WorshipGuideModal visible={editing} guide={guide} onClose={() => setEditing(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  actions: {
    gap: 12,
    marginTop: 28,
  },
  missing: {
    ...FamilyTypography.body,
    marginBottom: 16,
  },
});
