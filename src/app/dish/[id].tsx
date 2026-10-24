import { MOCK_DISHES } from '@/constants/mockData';
import { DishDetailScreen } from '@/screens/DishDetailScreen';

export function generateStaticParams() {
  return MOCK_DISHES.map((dish) => ({ id: dish.id }));
}

export default DishDetailScreen;
