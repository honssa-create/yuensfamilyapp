import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppModal } from '@/components/common/AppModal';
import { FormField, FormInput } from '@/components/common/FormField';
import { GoldButton } from '@/components/common/GoldButton';
import { useAppContext } from '@/context/AppContext';
import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import type { FamilyTreePerson } from '@/types';
import { parentIdsOf, spouseIdOf } from '@/utils/familyTree';

interface FamilyTreePersonModalProps {
  visible: boolean;
  onClose: () => void;
  person?: FamilyTreePerson | null;
  /** When adding someone, start with this person already chosen as a parent. */
  presetParentId?: string;
}

export function FamilyTreePersonModal({
  visible,
  onClose,
  person,
  presetParentId,
}: FamilyTreePersonModalProps) {
  const { familyTree, addFamilyTreePerson, updateFamilyTreePerson } = useAppContext();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [spouseId, setSpouseId] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;
    setName(person?.name ?? '');
    setAge(person ? String(person.age) : '');
    setBio(person?.bio ?? '');
    setParentIds(person ? parentIdsOf(person) : presetParentId ? [presetParentId] : []);
    setSpouseId(person ? spouseIdOf(person, familyTree) : undefined);
    // Reset only when the dialog opens or the edited person changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, person?.id, presetParentId]);

  const others = familyTree.filter((item) => item.id !== person?.id);

  const toggleParent = (id: string) => {
    setParentIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
    setSpouseId((current) => (current === id ? undefined : current));
  };

  const selectSpouse = (id?: string) => {
    setSpouseId(id);
    if (id) setParentIds((current) => current.filter((item) => item !== id));
  };

  const handleSave = () => {
    const trimmed = name.trim();
    const ageNumber = Number(age);
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }
    if (!Number.isInteger(ageNumber) || ageNumber < 0 || ageNumber > 130) {
      Alert.alert('Age required', 'Please enter an age from 0 to 130.');
      return;
    }

    const input = {
      name: trimmed,
      age: ageNumber,
      bio: bio.trim(),
      parentIds,
      spouseId: spouseId ?? null,
    };

    if (person) {
      updateFamilyTreePerson(person.id, input);
    } else {
      addFamilyTreePerson(input);
    }
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      title={person ? 'Edit info · 修改' : 'Add person · 加入'}
      onClose={onClose}>
      <FormField label="Name">
        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          autoCapitalize="words"
        />
      </FormField>

      <FormField label="Age">
        <FormInput
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="number-pad"
        />
      </FormField>

      <FormField label="Bio">
        <FormInput
          value={bio}
          onChangeText={setBio}
          placeholder="A few lines about this person"
          multiline
        />
      </FormField>

      {others.length > 0 ? (
        <>
          <FormField label="Parents · optional">
            <Text style={styles.hint}>Choose up to two. Leave blank to keep them unlinked.</Text>
            <View style={styles.chips}>
              {others.map((item) => {
                const active = parentIds.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleParent(item.id)}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </FormField>

          <FormField label="Spouse · optional">
            <View style={styles.chips}>
              <Pressable
                onPress={() => selectSpouse(undefined)}
                style={[styles.chip, !spouseId && styles.chipActive]}>
                <Text style={[styles.chipText, !spouseId && styles.chipTextActive]}>None</Text>
              </Pressable>
              {others.map((item) => {
                const active = spouseId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => selectSpouse(item.id)}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </FormField>
        </>
      ) : null}

      <GoldButton label={person ? 'Save changes' : 'Add person'} onPress={handleSave} />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...FamilyTypography.caption,
    marginTop: -4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: FamilySpacing.sm,
  },
  chip: {
    paddingHorizontal: FamilySpacing.md,
    paddingVertical: FamilySpacing.sm,
    borderRadius: FamilyRadius.md,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    backgroundColor: FamilyPalette.cream,
  },
  chipActive: {
    borderColor: FamilyPalette.champagne,
    backgroundColor: FamilyPalette.champagneLight,
  },
  chipText: {
    ...FamilyTypography.body,
    fontSize: 14,
    color: FamilyPalette.charcoalMuted,
  },
  chipTextActive: {
    color: FamilyPalette.charcoal,
    fontWeight: '500',
  },
});
