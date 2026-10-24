import { StyleSheet, Text, View } from 'react-native';

import { GoldButton } from '@/components/common/GoldButton';
import { FamilySpacing, FamilyTypography } from '@/constants/familyTheme';

interface MemberContributeProps {
  hint: string;
  label: string;
  onPress: () => void;
}

/** Visible add action for any household member, not a hidden admin control. */
export function MemberContribute({ hint, label, onPress }: MemberContributeProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>{hint}</Text>
      <GoldButton label={label} onPress={onPress} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: FamilySpacing.sm,
    marginBottom: FamilySpacing.lg,
  },
  hint: {
    ...FamilyTypography.caption,
  },
});
