import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { GoldButton } from '@/components/common/GoldButton';
import { MemberContribute } from '@/components/common/MemberContribute';
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
import type { WorshipGuide } from '@/types';

export function WorshipGuidesScreen() {
  const router = useRouter();
  const { worshipGuides } = useAppContext();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<WorshipGuide | null>(null);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader
          eyebrow="祭祀指引 · Guides"
          title="How we observe"
          subtitle="Any member can add a guide or change the steps."
        />
        <MemberContribute
          hint="Write a title and one step per line."
          label="Add info · 加入"
          onPress={() => setAdding(true)}
        />
        {worshipGuides.length === 0 ? (
          <WorshipEmpty text="No guides yet." />
        ) : (
          worshipGuides.map((guide) => {
            const first = guide.body.split('\n').map((line) => line.trim()).find(Boolean);
            return (
              <WorshipCard
                key={guide.id}
                title={guide.title}
                detail={first}
                onPress={() => router.push(`/worship/guide/${guide.id}`)}
                actionLabel="Edit info · 修改"
                onAction={() => setEditing(guide)}
              />
            );
          })
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <WorshipGuideModal
        visible={adding || editing != null}
        guide={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
      />
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
        <MemberContribute
          hint="Any household member can change these steps."
          label="Edit info · 修改"
          onPress={() => setEditing(true)}
        />
        <Checklist body={guide.body} />
        <View style={styles.actions}>
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
