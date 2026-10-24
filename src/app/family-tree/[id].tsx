import { MOCK_FAMILY_TREE } from '@/constants/mockData';
import { FamilyTreeDetailScreen } from '@/screens/FamilyTreeDetailScreen';

export function generateStaticParams() {
  return MOCK_FAMILY_TREE.map((person) => ({ id: person.id }));
}

export default FamilyTreeDetailScreen;
