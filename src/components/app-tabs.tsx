import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { FamilyPalette } from '@/constants/familyTheme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={FamilyPalette.softWhite}
      indicatorColor={FamilyPalette.champagneLight}
      labelStyle={{ selected: { color: FamilyPalette.charcoal } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Members</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2.fill" md="group" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="family-tree">
        <NativeTabs.Trigger.Label>Family Tree</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="tree.fill" md="account_tree" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="worship">
        <NativeTabs.Trigger.Label>祭祀</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="flame.fill" md="local_fire_department" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="places">
        <NativeTabs.Trigger.Label>地點</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="mappin.and.ellipse" md="place" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="dishes">
        <NativeTabs.Trigger.Label>Dishes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="community">
        <NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="globe" md="public" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="meal-planner">
        <NativeTabs.Trigger.Label>Planner</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
