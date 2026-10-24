import { MOCK_WORSHIP_OCCASIONS } from '@/constants/worship';
import { WorshipDateDetailScreen } from '@/screens/worship/WorshipDatesScreen';

export function generateStaticParams() {
  return MOCK_WORSHIP_OCCASIONS.map((occasion) => ({ id: occasion.id }));
}

export default WorshipDateDetailScreen;
