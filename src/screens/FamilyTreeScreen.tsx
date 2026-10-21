import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FamilyTreeCard } from '@/components/family-tree/FamilyTreeCard';
import { FamilyTreePersonModal } from '@/components/family-tree/FamilyTreePersonModal';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { useAppContext } from '@/context/AppContext';
import {
  FamilyPalette,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import { generationLabel, layoutFamilyTree } from '@/utils/familyTree';

export function FamilyTreeScreen() {
  const router = useRouter();
  const { familyTree } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const generations = layoutFamilyTree(familyTree);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <View style={styles.header}>
          <Text style={styles.label}>族譜 · Family Tree</Text>
          <Text style={styles.title}>Our Line</Text>
          <Text style={styles.subtitle}>
            Names, ages, and a few lines for the people who make this family.
          </Text>
        </View>

        {generations.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>The tree is quiet. Tap + to add the first person.</Text>
          </View>
        ) : (
          generations.map((generation, generationIndex) => (
            <View key={generation.index} style={styles.generation}>
              {generationIndex > 0 ? (
                <View style={styles.connector}>
                  <View style={styles.connectorLine} />
                </View>
              ) : null}
              <Text style={styles.generationLabel}>{generationLabel(generation.index)}</Text>
              <View style={styles.row}>
                {generation.units.map((unit) => (
                  <View key={unit.key} style={styles.unit}>
                    {unit.people.map((person, personIndex) => (
                      <View key={person.id} style={styles.personSlot}>
                        {personIndex > 0 ? <View style={styles.spouseLine} /> : null}
                        <FamilyTreeCard
                          person={person}
                          onPress={() => router.push(`/family-tree/${person.id}`)}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScreenContainer>

      <FloatingActionButton onPress={() => setModalVisible(true)} />
      <FamilyTreePersonModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    marginBottom: FamilySpacing.xl,
    gap: FamilySpacing.sm,
  },
  label: {
    ...FamilyTypography.label,
  },
  title: {
    ...FamilyTypography.title,
  },
  subtitle: {
    ...FamilyTypography.body,
    marginTop: FamilySpacing.xs,
  },
  generation: {
    marginBottom: FamilySpacing.lg,
    gap: FamilySpacing.md,
  },
  generationLabel: {
    ...FamilyTypography.label,
  },
  connector: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
  },
  connectorLine: {
    width: 1,
    height: 28,
    backgroundColor: FamilyPalette.champagneMuted,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: FamilySpacing.lg,
  },
  unit: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: FamilySpacing.sm,
  },
  personSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FamilySpacing.sm,
  },
  spouseLine: {
    width: 18,
    height: 1,
    backgroundColor: FamilyPalette.champagne,
  },
  empty: {
    paddingVertical: FamilySpacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...FamilyTypography.caption,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
