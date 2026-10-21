import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';

export function WorshipBack({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.back} accessibilityRole="button">
      <Text style={styles.backText}>← Back</Text>
    </Pressable>
  );
}

export function WorshipHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function WorshipCard({
  kicker,
  title,
  detail,
  onPress,
}: {
  kicker?: string;
  title: string;
  detail?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text style={styles.cardTitle}>{title}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </Pressable>
  );
}

export function WorshipEmpty({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function ChoiceChips({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value?: string;
  onChange: (id: string | undefined) => void;
}) {
  return (
    <View style={styles.chips}>
      <Pressable
        onPress={() => onChange(undefined)}
        style={[styles.chip, !value && styles.chipActive]}>
        <Text style={[styles.chipText, !value && styles.chipTextActive]}>None</Text>
      </Pressable>
      {options.map((option) => {
        const active = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Checklist({ body }: { body: string }) {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return <Text style={styles.detail}>No notes yet.</Text>;
  }

  return (
    <View style={styles.list}>
      {lines.map((line, index) => (
        <View key={`${index}-${line}`} style={styles.line}>
          <View style={styles.mark} />
          <Text style={styles.lineText}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

export function WorshipSection({ children }: { children: ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

const styles = StyleSheet.create({
  back: {
    marginBottom: FamilySpacing.lg,
  },
  backText: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.6,
  },
  header: {
    marginBottom: FamilySpacing.xl,
    gap: FamilySpacing.sm,
  },
  eyebrow: {
    ...FamilyTypography.label,
  },
  title: {
    ...FamilyTypography.title,
  },
  subtitle: {
    ...FamilyTypography.body,
    marginTop: FamilySpacing.xs,
  },
  card: {
    backgroundColor: FamilyPalette.softWhite,
    borderRadius: FamilyRadius.lg,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    padding: FamilySpacing.lg,
    marginBottom: FamilySpacing.md,
    gap: FamilySpacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  kicker: {
    ...FamilyTypography.label,
    fontSize: 11,
  },
  cardTitle: {
    ...FamilyTypography.heading,
    fontSize: 18,
  },
  detail: {
    ...FamilyTypography.caption,
    color: FamilyPalette.charcoalSoft,
    marginTop: FamilySpacing.xs,
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
  list: {
    gap: FamilySpacing.md,
  },
  line: {
    flexDirection: 'row',
    gap: FamilySpacing.md,
    alignItems: 'flex-start',
  },
  mark: {
    width: 6,
    height: 6,
    borderRadius: FamilyRadius.pill,
    backgroundColor: FamilyPalette.champagne,
    marginTop: 9,
  },
  lineText: {
    ...FamilyTypography.body,
    flex: 1,
  },
  section: {
    marginBottom: FamilySpacing.lg,
    gap: FamilySpacing.sm,
  },
});
