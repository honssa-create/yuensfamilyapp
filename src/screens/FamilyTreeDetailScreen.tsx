import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FamilyTreePersonModal } from '@/components/family-tree/FamilyTreePersonModal';
import { GoldButton } from '@/components/common/GoldButton';
import { MemberContribute } from '@/components/common/MemberContribute';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { useAppContext } from '@/context/AppContext';
import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import { childrenOf, parentIdsOf, spouseIdOf } from '@/utils/familyTree';

export function FamilyTreeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { familyTree, getFamilyTreePerson, deleteFamilyTreePerson } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const person = id ? getFamilyTreePerson(id) : undefined;

  if (!person) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>This person is no longer on the tree.</Text>
        <GoldButton label="Back to Family Tree" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const parents = parentIdsOf(person)
    .map((parentId) => familyTree.find((item) => item.id === parentId))
    .filter((item) => item != null);
  const spouseId = spouseIdOf(person, familyTree);
  const spouse = spouseId ? familyTree.find((item) => item.id === spouseId) : undefined;
  const children = childrenOf(person.id, familyTree);

  const confirmRemove = () => {
    Alert.alert('Remove from tree', `Remove ${person.name} from the family tree?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteFamilyTreePerson(person.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.label}>族譜 · Family Tree</Text>
        <Text style={styles.title}>{person.name}</Text>
        <Text style={styles.age}>Age {person.age}</Text>

        <MemberContribute
          hint="Any household member can update this name, age, bio, or relation."
          label="Edit info · 修改"
          onPress={() => setEditing(true)}
        />

        <Text style={styles.bio}>
          {person.bio || 'No bio yet. Add a few lines with Edit info.'}
        </Text>

        <RelationGroup
          label="Parents"
          people={parents}
          onPress={(personId) => router.push(`/family-tree/${personId}`)}
          onAdd={() => setEditing(true)}
        />
        <RelationGroup
          label="Spouse"
          people={spouse ? [spouse] : []}
          onPress={(personId) => router.push(`/family-tree/${personId}`)}
          onAdd={() => setEditing(true)}
        />
        <RelationGroup
          label="Children"
          people={children}
          onPress={(personId) => router.push(`/family-tree/${personId}`)}
          onAdd={() => setAddingChild(true)}
          emptyText="No children recorded"
          actionLabel="Add child · 加入"
        />

        <View style={styles.actions}>
          <GoldButton label="Remove from tree" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>

      <FamilyTreePersonModal
        visible={editing}
        person={person}
        onClose={() => setEditing(false)}
      />
      <FamilyTreePersonModal
        visible={addingChild}
        presetParentId={person.id}
        onClose={() => setAddingChild(false)}
      />
    </View>
  );
}

function RelationGroup({
  label,
  people,
  onPress,
  onAdd,
  emptyText = 'Not recorded yet',
  actionLabel = 'Add info · 加入',
}: {
  label: string;
  people: { id: string; name: string; age: number }[];
  onPress: (id: string) => void;
  onAdd: () => void;
  emptyText?: string;
  actionLabel?: string;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {people.length === 0 ? (
        <Pressable onPress={onAdd} style={styles.linkRow} accessibilityRole="button">
          <Text style={styles.linkName}>{emptyText}</Text>
          <Text style={styles.addLink}>{actionLabel}</Text>
        </Pressable>
      ) : (
        people.map((item) => (
          <Pressable key={item.id} onPress={() => onPress(item.id)} style={styles.linkRow}>
            <Text style={styles.linkName}>{item.name}</Text>
            <Text style={styles.linkAge}>Age {item.age}</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  back: {
    marginBottom: FamilySpacing.lg,
  },
  backText: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.6,
  },
  label: {
    ...FamilyTypography.label,
    marginBottom: FamilySpacing.sm,
  },
  title: {
    ...FamilyTypography.title,
  },
  age: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    marginTop: FamilySpacing.sm,
    letterSpacing: 0.6,
  },
  bio: {
    ...FamilyTypography.body,
    marginTop: FamilySpacing.lg,
    marginBottom: FamilySpacing.xl,
  },
  group: {
    marginBottom: FamilySpacing.lg,
    gap: FamilySpacing.sm,
  },
  groupLabel: {
    ...FamilyTypography.label,
  },
  linkRow: {
    backgroundColor: FamilyPalette.softWhite,
    borderRadius: FamilyRadius.md,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    paddingHorizontal: FamilySpacing.md,
    paddingVertical: FamilySpacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: FamilySpacing.md,
  },
  linkName: {
    ...FamilyTypography.body,
    color: FamilyPalette.charcoal,
    flex: 1,
  },
  linkAge: {
    ...FamilyTypography.caption,
  },
  addLink: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.3,
  },
  actions: {
    marginTop: FamilySpacing.md,
    gap: FamilySpacing.md,
  },
  empty: {
    ...FamilyTypography.body,
    marginBottom: FamilySpacing.lg,
  },
});
