import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AppModal } from '@/components/common/AppModal';
import { FormField, FormInput } from '@/components/common/FormField';
import { GoldButton } from '@/components/common/GoldButton';
import { useAppContext } from '@/context/AppContext';
import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import type { Place } from '@/types';

interface DraftPhoto {
  key: string;
  uri: string;
  caption: string;
}

function draftKey() {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PlaceEditor({
  visible,
  place,
  onClose,
}: {
  visible: boolean;
  place?: Place | null;
  onClose: () => void;
}) {
  const { addPlace, updatePlace } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [photoLink, setPhotoLink] = useState('');

  useEffect(() => {
    if (!visible) return;
    setName(place?.name ?? '');
    setAddress(place?.address ?? '');
    setNotes(place?.notes ?? '');
    setPhotos(
      (place?.photos ?? []).map((photo) => ({
        key: photo.id,
        uri: photo.uri,
        caption: photo.caption,
      })),
    );
    setPhotoLink('');
  }, [visible, place]);

  const addDraft = (uri: string) => {
    setPhotos((prev) => [...prev, { key: draftKey(), uri, caption: '' }]);
  };

  const addLink = () => {
    const uri = photoLink.trim();
    if (!/^https?:\/\//i.test(uri)) {
      Alert.alert('Photo link', 'Paste a link that starts with http:// or https://.');
      return;
    }
    addDraft(uri);
    setPhotoLink('');
  };

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add a picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      addDraft(result.assets[0].uri);
    }
  };

  const save = () => {
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const pendingLink = photoLink.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Name this place.');
      return;
    }
    if (!trimmedAddress) {
      Alert.alert('Address required', 'Add the address.');
      return;
    }
    if (pendingLink && !/^https?:\/\//i.test(pendingLink)) {
      Alert.alert('Photo link', 'Paste a link that starts with http:// or https://.');
      return;
    }
    const drafts = pendingLink
      ? [...photos, { key: draftKey(), uri: pendingLink, caption: '' }]
      : photos;
    const input = {
      name: trimmedName,
      address: trimmedAddress,
      notes: notes.trim(),
      photos: drafts
        .map((photo) => ({
          id: photo.key.startsWith('draft-') ? undefined : photo.key,
          uri: photo.uri.trim(),
          caption: photo.caption.trim(),
        }))
        .filter((photo) => photo.uri.length > 0),
    };
    if (place) updatePlace(place.id, input);
    else addPlace(input);
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      title={place ? 'Edit info · 修改' : 'Add place · 加入'}
      onClose={onClose}>
      <FormField label="Name">
        <FormInput value={name} onChangeText={setName} placeholder="Flat 10J" />
      </FormField>
      <FormField label="Address">
        <FormInput
          value={address}
          onChangeText={setAddress}
          placeholder="Where to find it"
          multiline
        />
      </FormField>
      <FormField label="Notes">
        <FormInput
          value={notes}
          onChangeText={setNotes}
          placeholder="What the family should remember"
          multiline
        />
      </FormField>
      <FormField label="Photos">
        <Text style={styles.hint}>Add a photo link, or choose one from this device.</Text>
        {photos.map((photo) => (
          <View key={photo.key} style={styles.photoRow}>
            <Image source={{ uri: photo.uri }} style={styles.thumb} />
            <View style={styles.photoFields}>
              <FormInput
                value={photo.caption}
                onChangeText={(caption) =>
                  setPhotos((prev) =>
                    prev.map((item) => (item.key === photo.key ? { ...item, caption } : item)),
                  )
                }
                placeholder="Caption"
              />
              <Pressable
                onPress={() => setPhotos((prev) => prev.filter((item) => item.key !== photo.key))}
                accessibilityRole="button">
                <Text style={styles.remove}>Remove photo</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <FormInput
          value={photoLink}
          onChangeText={setPhotoLink}
          placeholder="https://"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.photoActions}>
          <GoldButton label="Add photo link" onPress={addLink} variant="outline" />
          <GoldButton label="Choose photo" onPress={choosePhoto} variant="outline" />
        </View>
      </FormField>
      <GoldButton label={place ? 'Save changes' : 'Add place'} onPress={save} />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...FamilyTypography.caption,
    marginTop: -4,
  },
  photoRow: {
    flexDirection: 'row',
    gap: FamilySpacing.sm,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: FamilyRadius.md,
    backgroundColor: FamilyPalette.champagneLight,
  },
  photoFields: {
    flex: 1,
    gap: FamilySpacing.xs,
  },
  remove: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
  },
  photoActions: {
    gap: FamilySpacing.sm,
  },
});
