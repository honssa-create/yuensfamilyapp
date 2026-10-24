import { MOCK_PUBLIC_DISHES } from '@/constants/mockData';
import { CommunityDishDetailScreen } from '@/screens/CommunityDishDetailScreen';

export function generateStaticParams() {
  return MOCK_PUBLIC_DISHES.map((dish) => ({ id: dish.id }));
}

export default CommunityDishDetailScreen;
