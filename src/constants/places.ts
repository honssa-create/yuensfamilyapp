import type { Place } from '@/types';

export const MOCK_PLACES: Place[] = [
  {
    id: 'pl-10j',
    name: 'Flat 10J',
    address: 'Flat 10J, Yuen household',
    notes: 'Sunday table, the ancestral altar, and the balcony herbs. Shoes off at the door.',
    photos: [
      {
        id: 'ph-10j-table',
        uri: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        caption: 'The long table after lunch',
      },
      {
        id: 'ph-10j-light',
        uri: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        caption: 'Afternoon light in the living room',
      },
    ],
  },
  {
    id: 'pl-20c',
    name: 'Flat 20C',
    address: 'Flat 20C, Yuen household',
    notes: 'The quieter flat. Extra chairs live in the hall cupboard.',
    photos: [],
  },
  {
    id: 'pl-saikung',
    name: 'Sai Kung waterfront',
    address: 'Sai Kung Waterfront, New Territories',
    notes: 'Seafood lunch when the weather is kind. Book the round table if everyone is coming.',
    photos: [
      {
        id: 'ph-sk-water',
        uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'The water on a clear day',
      },
    ],
  },
];
