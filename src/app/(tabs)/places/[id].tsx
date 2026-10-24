import { MOCK_PLACES } from '@/constants/places';
import { PlaceProfileScreen } from '@/screens/PlacesScreen';

export function generateStaticParams() {
  return MOCK_PLACES.map((place) => ({ id: place.id }));
}

export default PlaceProfileScreen;
