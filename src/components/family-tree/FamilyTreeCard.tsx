import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import type { FamilyTreePerson } from '@/types';

interface FamilyTreeCardProps {
  person: FamilyTreePerson;
  onPress: () => void;
}

export function FamilyTreeCard({ person, onPress }: FamilyTreeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${person.name}, age ${person.age}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.initial}>
        <Text style={styles.initialText}>{person.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{person.name}</Text>
      <Text style={styles.age}>Age {person.age}</Text>
      {person.bio ? (
        <Text style={styles.bio} numberOfLines={3}>
          {person.bio}
        </Text>
      ) : (
        <Text style={styles.bioMuted}>No bio yet</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: FamilyPalette.softWhite,
    borderRadius: FamilyRadius.lg,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    padding: FamilySpacing.md,
    gap: FamilySpacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  initial: {
    width: 36,
    height: 36,
    borderRadius: FamilyRadius.pill,
    backgroundColor: FamilyPalette.champagneLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: FamilySpacing.xs,
  },
  initialText: {
    fontSize: 16,
    fontWeight: '300',
    color: FamilyPalette.champagne,
  },
  name: {
    ...FamilyTypography.heading,
    fontSize: 16,
  },
  age: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.4,
  },
  bio: {
    ...FamilyTypography.caption,
    color: FamilyPalette.charcoalSoft,
    marginTop: FamilySpacing.xs,
  },
  bioMuted: {
    ...FamilyTypography.caption,
    fontStyle: 'italic',
    marginTop: FamilySpacing.xs,
  },
});
