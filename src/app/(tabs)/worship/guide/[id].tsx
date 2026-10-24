import { MOCK_WORSHIP_GUIDES } from '@/constants/worship';
import { WorshipGuideDetailScreen } from '@/screens/worship/WorshipGuidesScreen';

export function generateStaticParams() {
  return MOCK_WORSHIP_GUIDES.map((guide) => ({ id: guide.id }));
}

export default WorshipGuideDetailScreen;
