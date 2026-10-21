import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { AppModal } from '@/components/common/AppModal';
import { FormField, FormInput } from '@/components/common/FormField';
import { GoldButton } from '@/components/common/GoldButton';
import { ChoiceChips } from '@/components/worship/WorshipChrome';
import { FamilyTypography } from '@/constants/familyTheme';
import { useAppContext } from '@/context/AppContext';
import type { WorshipGuide, WorshipOccasion, WorshipRecord } from '@/types';
import { isValidDateString, isValidMonthDay } from '@/utils/date';

function Hint({ text }: { text: string }) {
  return <Text style={styles.hint}>{text}</Text>;
}

export function WorshipRecordModal({
  visible,
  onClose,
  record,
}: {
  visible: boolean;
  onClose: () => void;
  record?: WorshipRecord | null;
}) {
  const { worshipAddresses, worshipOccasions, addWorshipRecord, updateWorshipRecord } = useAppContext();
  const [date, setDate] = useState('');
  const [what, setWhat] = useState('');
  const [notes, setNotes] = useState('');
  const [addressId, setAddressId] = useState<string | undefined>();
  const [occasionId, setOccasionId] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;
    setDate(record?.date ?? '');
    setWhat(record?.what ?? '');
    setNotes(record?.notes ?? '');
    setAddressId(record?.addressId);
    setOccasionId(record?.occasionId);
  }, [visible, record]);

  const save = () => {
    const trimmedWhat = what.trim();
    if (!isValidDateString(date.trim())) {
      Alert.alert('Date required', 'Use a Gregorian date, YYYY-MM-DD.');
      return;
    }
    if (!trimmedWhat) {
      Alert.alert('Details required', 'Note what was done.');
      return;
    }
    const input = {
      date: date.trim(),
      what: trimmedWhat,
      notes: notes.trim(),
      addressId: addressId ?? null,
      occasionId: occasionId ?? null,
    };
    if (record) updateWorshipRecord(record.id, input);
    else addWorshipRecord(input);
    onClose();
  };

  return (
    <AppModal visible={visible} title={record ? 'Edit Record' : 'Add Record'} onClose={onClose}>
      <FormField label="Date">
        <FormInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      </FormField>
      <FormField label="What was done">
        <FormInput value={what} onChangeText={setWhat} placeholder="清明拜山" />
      </FormField>
      <FormField label="Notes">
        <FormInput value={notes} onChangeText={setNotes} placeholder="Who went, what was offered" multiline />
      </FormField>
      <FormField label="Yearly date · optional">
        <ChoiceChips
          options={worshipOccasions.map((item) => ({ id: item.id, label: item.name }))}
          value={occasionId}
          onChange={setOccasionId}
        />
      </FormField>
      <FormField label="Address · optional">
        <ChoiceChips
          options={worshipAddresses.map((item) => ({ id: item.id, label: item.name }))}
          value={addressId}
          onChange={setAddressId}
        />
      </FormField>
      <GoldButton label={record ? 'Save Changes' : 'Add Record'} onPress={save} />
    </AppModal>
  );
}

export function WorshipGuideModal({
  visible,
  onClose,
  guide,
}: {
  visible: boolean;
  onClose: () => void;
  guide?: WorshipGuide | null;
}) {
  const { addWorshipGuide, updateWorshipGuide } = useAppContext();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTitle(guide?.title ?? '');
    setBody(guide?.body ?? '');
  }, [visible, guide]);

  const save = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Title required', 'Name this guide.');
      return;
    }
    const input = { title: trimmed, body: body.trim() };
    if (guide) updateWorshipGuide(guide.id, input);
    else addWorshipGuide(input);
    onClose();
  };

  return (
    <AppModal visible={visible} title={guide ? 'Edit Guide' : 'Add Guide'} onClose={onClose}>
      <FormField label="Title">
        <FormInput value={title} onChangeText={setTitle} placeholder="拜山準備" />
      </FormField>
      <FormField label="Notes">
        <Hint text="One step per line. These read as a checklist." />
        <FormInput value={body} onChangeText={setBody} placeholder={'鮮花、生果\n先淨手，再上香'} multiline />
      </FormField>
      <GoldButton label={guide ? 'Save Changes' : 'Add Guide'} onPress={save} />
    </AppModal>
  );
}

export function WorshipOccasionModal({
  visible,
  onClose,
  occasion,
}: {
  visible: boolean;
  onClose: () => void;
  occasion?: WorshipOccasion | null;
}) {
  const { worshipAddresses, addWorshipOccasion, updateWorshipOccasion } = useAppContext();
  const [name, setName] = useState('');
  const [monthDay, setMonthDay] = useState('');
  const [note, setNote] = useState('');
  const [addressId, setAddressId] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;
    setName(occasion?.name ?? '');
    setMonthDay(occasion?.monthDay ?? '');
    setNote(occasion?.note ?? '');
    setAddressId(occasion?.addressId);
  }, [visible, occasion]);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Name this occasion.');
      return;
    }
    if (!isValidMonthDay(monthDay.trim())) {
      Alert.alert('Date required', 'Use a Gregorian month and day, MM-DD.');
      return;
    }
    const input = {
      name: trimmed,
      monthDay: monthDay.trim(),
      note: note.trim(),
      addressId: addressId ?? null,
    };
    if (occasion) updateWorshipOccasion(occasion.id, input);
    else addWorshipOccasion(input);
    onClose();
  };

  return (
    <AppModal visible={visible} title={occasion ? 'Edit Yearly Date' : 'Add Yearly Date'} onClose={onClose}>
      <FormField label="Occasion">
        <FormInput value={name} onChangeText={setName} placeholder="清明 Ching Ming" />
      </FormField>
      <FormField label="Gregorian date">
        <Hint text="Repeats every year. Put the lunar date (農曆) in the note." />
        <FormInput value={monthDay} onChangeText={setMonthDay} placeholder="MM-DD" />
      </FormField>
      <FormField label="Note">
        <FormInput value={note} onChangeText={setNote} placeholder="農曆九月初九" multiline />
      </FormField>
      <FormField label="Address · optional">
        <ChoiceChips
          options={worshipAddresses.map((item) => ({ id: item.id, label: item.name }))}
          value={addressId}
          onChange={setAddressId}
        />
      </FormField>
      <GoldButton label={occasion ? 'Save Changes' : 'Add Date'} onPress={save} />
    </AppModal>
  );
}

export function WorshipAddressModal({
  visible,
  onClose,
  address,
}: {
  visible: boolean;
  onClose: () => void;
  address?: { id: string; name: string; address: string; note: string } | null;
}) {
  const { addWorshipAddress, updateWorshipAddress } = useAppContext();
  const [name, setName] = useState('');
  const [line, setLine] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!visible) return;
    setName(address?.name ?? '');
    setLine(address?.address ?? '');
    setNote(address?.note ?? '');
  }, [visible, address]);

  const save = () => {
    const trimmedName = name.trim();
    const trimmedLine = line.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Name this place.');
      return;
    }
    if (!trimmedLine) {
      Alert.alert('Address required', 'Add the address.');
      return;
    }
    const input = { name: trimmedName, address: trimmedLine, note: note.trim() };
    if (address) updateWorshipAddress(address.id, input);
    else addWorshipAddress(input);
    onClose();
  };

  return (
    <AppModal visible={visible} title={address ? 'Edit Address' : 'Add Address'} onClose={onClose}>
      <FormField label="Name">
        <FormInput value={name} onChangeText={setName} placeholder="Yuen Family Grave" />
      </FormField>
      <FormField label="Address">
        <FormInput value={line} onChangeText={setLine} placeholder="Where to go" multiline />
      </FormField>
      <FormField label="Note">
        <FormInput value={note} onChangeText={setNote} placeholder="Optional" multiline />
      </FormField>
      <GoldButton label={address ? 'Save Changes' : 'Add Address'} onPress={save} />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...FamilyTypography.caption,
    marginTop: -4,
  },
});
