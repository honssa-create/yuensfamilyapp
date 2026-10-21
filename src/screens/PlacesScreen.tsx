import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { GoldButton } from '@/components/common/GoldButton';
import { MemberContribute } from '@/components/common/MemberContribute';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { PlaceEditor } from '@/components/places/PlaceEditor';
import {
  WorshipBack,
  WorshipEmpty,
  WorshipHeader,
  WorshipPrompt,
  WorshipSection,
} from '@/components/worship/WorshipChrome';
import { useAppContext } from '@/context/AppContext';
import {
  FamilyPalette,
  FamilyRadius,
  FamilySpacing,
  FamilyTypography,
} from '@/constants/familyTheme';
import type { Place, PlacePhoto } from '@/types';

export function PlacesScreen() {
  const router = useRouter();
  const { places } = useAppContext();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Place | null>(null);

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipHeader
          eyebrow="地點 · Places"
          title="Where we gather"
          subtitle="Homes, tables, and the places this family returns to. Any member can add a place or update its address, photos, and notes."
        />
        <MemberContribute
          hint="Name the place, add the address, and attach photos or a note when you have them."
          label="Add place · 加入"
          onPress={() => setAdding(true)}
        />
        {places.length === 0 ? (
          <WorshipEmpty text="No places yet. Add the first one above." />
        ) : (
          places.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              onOpen={() => router.push(`/places/${place.id}`)}
              onEdit={() => setEditing(place)}
            />
          ))
        )}
      </ScreenContainer>
      <FloatingActionButton onPress={() => setAdding(true)} />
      <PlaceEditor
        visible={adding || editing != null}
        place={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
      />
    </View>
  );
}

function PlaceRow({
  place,
  onOpen,
  onEdit,
}: {
  place: Place;
  onOpen: () => void;
  onEdit: () => void;
}) {
  const cover = place.photos[0];
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={place.name}
        style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}>
        <PlaceThumb uri={cover?.uri} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{place.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={2}>
            {place.address}
          </Text>
          <Text style={styles.cardMeta}>
            {place.photos.length === 0
              ? 'No photos yet'
              : `${place.photos.length} ${place.photos.length === 1 ? 'photo' : 'photos'}`}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${place.name}`}
        style={styles.editHit}>
        <Text style={styles.edit}>Edit info · 修改</Text>
      </Pressable>
    </View>
  );
}

export function PlaceProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { places, deletePlace } = useAppContext();
  const [editing, setEditing] = useState(false);
  const place = places.find((item) => item.id === id);

  if (!place) {
    return (
      <ScreenContainer>
        <Text style={styles.missing}>This place is no longer here.</Text>
        <GoldButton label="Back to Places" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Remove place', `Remove “${place.name}” from Places?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deletePlace(place.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <WorshipBack onPress={() => router.back()} />
        <WorshipHeader eyebrow="地點 · Place" title={place.name} />
        <MemberContribute
          hint="Any household member can update the address, photos, and notes."
          label="Edit info · 修改"
          onPress={() => setEditing(true)}
        />

        <WorshipSection>
          <Text style={styles.sectionLabel}>Address</Text>
          <Text style={styles.body}>{place.address}</Text>
        </WorshipSection>

        <WorshipSection>
          <Text style={styles.sectionLabel}>Photos</Text>
          {place.photos.length === 0 ? (
            <WorshipPrompt label="No photos yet" onPress={() => setEditing(true)} />
          ) : (
            <View style={styles.gallery}>
              {place.photos.map((photo) => (
                <PlacePhotoFrame key={photo.id} photo={photo} />
              ))}
              <Pressable onPress={() => setEditing(true)} accessibilityRole="button">
                <Text style={styles.edit}>Add photo · 加入</Text>
              </Pressable>
            </View>
          )}
        </WorshipSection>

        <WorshipSection>
          <Text style={styles.sectionLabel}>Notes</Text>
          {place.notes ? (
            <Text style={styles.body}>{place.notes}</Text>
          ) : (
            <WorshipPrompt label="No notes yet" onPress={() => setEditing(true)} />
          )}
        </WorshipSection>

        <View style={styles.actions}>
          <GoldButton label="Remove place" onPress={confirmRemove} variant="outline" />
        </View>
      </ScreenContainer>
      <PlaceEditor visible={editing} place={place} onClose={() => setEditing(false)} />
    </View>
  );
}

function PlaceThumb({ uri }: { uri?: string }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View style={styles.thumbFallback}>
        <Text style={styles.thumbMark}>地</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={styles.thumb}
      contentFit="cover"
      onError={() => setFailed(true)}
    />
  );
}

function PlacePhotoFrame({ photo }: { photo: PlacePhoto }) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={styles.frame}>
      {failed ? (
        <View style={styles.frameFallback}>
          <Text style={styles.thumbMark}>Photo</Text>
        </View>
      ) : (
        <Image
          source={{ uri: photo.uri }}
          style={styles.frameImage}
          contentFit="cover"
          onError={() => setFailed(true)}
        />
      )}
      {photo.caption ? <Text style={styles.caption}>{photo.caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: {
    backgroundColor: FamilyPalette.softWhite,
    borderRadius: FamilyRadius.lg,
    borderWidth: 1,
    borderColor: FamilyPalette.border,
    padding: FamilySpacing.lg,
    marginBottom: FamilySpacing.md,
    gap: FamilySpacing.sm,
  },
  cardBody: {
    flexDirection: 'row',
    gap: FamilySpacing.md,
    alignItems: 'center',
  },
  pressed: { opacity: 0.88 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: FamilyRadius.md,
    backgroundColor: FamilyPalette.champagneLight,
  },
  thumbFallback: {
    width: 72,
    height: 72,
    borderRadius: FamilyRadius.md,
    backgroundColor: FamilyPalette.champagneLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbMark: {
    ...FamilyTypography.label,
    color: FamilyPalette.champagne,
  },
  cardText: {
    flex: 1,
    gap: FamilySpacing.xs,
  },
  cardTitle: {
    ...FamilyTypography.heading,
    fontSize: 18,
  },
  cardAddress: {
    ...FamilyTypography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    ...FamilyTypography.caption,
  },
  editHit: {
    marginTop: FamilySpacing.xs,
    paddingTop: FamilySpacing.sm,
    borderTopWidth: 1,
    borderTopColor: FamilyPalette.border,
  },
  edit: {
    ...FamilyTypography.caption,
    color: FamilyPalette.champagne,
    letterSpacing: 0.4,
  },
  sectionLabel: {
    ...FamilyTypography.label,
  },
  body: {
    ...FamilyTypography.body,
  },
  gallery: {
    gap: FamilySpacing.md,
  },
  frame: {
    gap: FamilySpacing.sm,
  },
  frameImage: {
    width: '100%',
    height: 220,
    borderRadius: FamilyRadius.lg,
    backgroundColor: FamilyPalette.champagneLight,
  },
  frameFallback: {
    width: '100%',
    height: 160,
    borderRadius: FamilyRadius.lg,
    backgroundColor: FamilyPalette.champagneLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    ...FamilyTypography.caption,
    color: FamilyPalette.charcoalSoft,
  },
  actions: {
    marginTop: FamilySpacing.sm,
  },
  missing: {
    ...FamilyTypography.body,
    marginBottom: FamilySpacing.md,
  },
});
