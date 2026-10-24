import { MOCK_WORSHIP_RECORDS } from '@/constants/worship';
import { WorshipRecordDetailScreen } from '@/screens/worship/WorshipRecordsScreen';

export function generateStaticParams() {
  return MOCK_WORSHIP_RECORDS.map((record) => ({ id: record.id }));
}

export default WorshipRecordDetailScreen;
