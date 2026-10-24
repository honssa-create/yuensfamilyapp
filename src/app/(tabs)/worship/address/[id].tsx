import { MOCK_WORSHIP_ADDRESSES } from '@/constants/worship';
import { WorshipAddressDetailScreen } from '@/screens/worship/WorshipAddressesScreen';

export function generateStaticParams() {
  return MOCK_WORSHIP_ADDRESSES.map((place) => ({ id: place.id }));
}

export default WorshipAddressDetailScreen;
