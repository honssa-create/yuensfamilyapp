import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, ScrollView, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';

import {
  BottomTabInset,
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  MaxContentWidth,
} from '@/constants/familyTheme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="members" href="/" asChild>
            <TabButton>Members</TabButton>
          </TabTrigger>
          <TabTrigger name="family-tree" href="/family-tree" asChild>
            <TabButton>Family Tree</TabButton>
          </TabTrigger>
          <TabTrigger name="worship" href="/worship" asChild>
            <TabButton>祭祀</TabButton>
          </TabTrigger>
          <TabTrigger name="dishes" href="/dishes" asChild>
            <TabButton>Dishes</TabButton>
          </TabTrigger>
          <TabTrigger name="community" href="/community" asChild>
            <TabButton>Community</TabButton>
          </TabTrigger>
          <TabTrigger name="planner" href="/meal-planner" asChild>
            <TabButton>Planner</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.tabButtonView, isFocused && styles.tabButtonFocused]}>
        <ThemedText
          type="small"
          style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
          {children}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroller}
        contentContainerStyle={styles.innerContainer}>
        {props.children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: FamilySpacing.lg,
    paddingBottom: FamilySpacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scroller: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexGrow: 0,
  },
  innerContainer: {
    paddingVertical: FamilySpacing.sm,
    paddingHorizontal: FamilySpacing.sm,
    borderRadius: FamilyRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: FamilySpacing.xs,
    backgroundColor: FamilyPalette.softWhite,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    shadowColor: FamilyPalette.charcoal,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    marginBottom: BottomTabInset - FamilySpacing.xl,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: FamilySpacing.sm + 2,
    paddingHorizontal: FamilySpacing.sm,
    borderRadius: FamilyRadius.md,
    alignItems: 'center',
  },
  tabButtonFocused: {
    backgroundColor: FamilyPalette.champagneLight,
  },
  tabLabel: {
    color: FamilyPalette.charcoalMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  tabLabelFocused: {
    color: FamilyPalette.charcoal,
    fontWeight: '500',
  },
});
