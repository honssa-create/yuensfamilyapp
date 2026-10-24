import type {
  WorshipAddress,
  WorshipGuide,
  WorshipOccasion,
  WorshipRecord,
} from '@/types';

export const MOCK_WORSHIP_ADDRESSES: WorshipAddress[] = [
  {
    id: 'wa-grave',
    name: 'Yuen Family Grave',
    address: 'Wo Hop Shek Cemetery, Fanling',
    note: '袁家祖墳。Arrive quietly, and leave the path clear for other families.',
  },
  {
    id: 'wa-altar',
    name: 'Home Ancestral Altar',
    address: 'Flat 10J',
    note: '家中祖先廳。Fresh water and incense in the morning.',
  },
];

export const MOCK_WORSHIP_OCCASIONS: WorshipOccasion[] = [
  {
    id: 'wo-ching',
    name: '清明 Ching Ming',
    monthDay: '04-04',
    note: '農曆日期每年不同。This Gregorian day is a reminder; follow the year’s Ching Ming.',
    addressId: 'wa-grave',
  },
  {
    id: 'wo-chong',
    name: '重陽 Chung Yeung',
    monthDay: '10-29',
    note: '農曆九月初九。The Gregorian date shifts slightly each year.',
    addressId: 'wa-grave',
  },
  {
    id: 'wo-new-year',
    name: '新年拜祖先',
    monthDay: '02-17',
    note: '農曆正月初一。The public calendar date changes every year — keep the lunar note.',
    addressId: 'wa-altar',
  },
];

export const MOCK_WORSHIP_RECORDS: WorshipRecord[] = [
  {
    id: 'wr-ching-2026',
    date: '2026-04-04',
    what: '清明拜山',
    notes: 'Flowers, fruit, and incense. The younger ones bowed after the elders.',
    addressId: 'wa-grave',
    occasionId: 'wo-ching',
  },
  {
    id: 'wr-chong-2025',
    date: '2025-10-29',
    what: '重陽拜祭',
    notes: 'A short visit after lunch. Swept the stone and replaced the flowers.',
    addressId: 'wa-grave',
    occasionId: 'wo-chong',
  },
  {
    id: 'wr-new-year-2026',
    date: '2026-02-17',
    what: '新年上香',
    notes: 'Offered tangerines at home before the family meal.',
    addressId: 'wa-altar',
    occasionId: 'wo-new-year',
  },
];

export const MOCK_WORSHIP_GUIDES: WorshipGuide[] = [
  {
    id: 'wg-grave',
    title: '拜山準備 Grave visit',
    body: '鮮花、生果、茶\n香燭，按家裡的習慣準備紙錢\n先淨手，再上香\n長輩先行禮，晚輩跟隨\n離開前把供品收拾乾淨',
  },
  {
    id: 'wg-home',
    title: '家中上香 Home incense',
    body: '清晨更換清水\n供品保持新鮮\n上香後稍候，不必久留\n香腳完全熄滅再離開',
  },
];
