import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppTheme } from '@/core/theme';
import { useFavoritesStore } from '@/features/favorites';
import {
  usePlaceSearch,
  useWeatherStore,
  type WeatherLocation,
} from '@/features/weather';

import type { CompareSlotId } from '../model/compareStore';

type SlotPickerProps = {
  slotId: CompareSlotId;
  onPick: (location: WeatherLocation) => void;
};

function placeMeta(place: WeatherLocation): string {
  return [place.country, `${place.lat.toFixed(2)}, ${place.lon.toFixed(2)}`]
    .filter(Boolean)
    .join(' · ');
}

export function SlotPicker({ slotId, onPick }: SlotPickerProps) {
  const theme = useAppTheme();
  const [open, setOpen] = useState(false);
  const favorites = useFavoritesStore((state) => state.items);
  const todayLocation = useWeatherStore((state) => state.selectedLocation);
  const { query, setQuery, results, status, errorMessage, clear } =
    usePlaceSearch();

  const label = slotId === 'a' ? 'Place A' : 'Place B';

  const pick = (location: WeatherLocation) => {
    onPick(location);
    clear();
    setOpen(false);
  };

  if (!open) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose ${label}`}
        onPress={() => setOpen(true)}
        style={[
          styles.choose,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>
          Choose {label}
        </Text>
      </Pressable>
    );
  }

  const showSearchPanel =
    query.trim().length >= 2 &&
    (status === 'loading' ||
      status === 'empty' ||
      status === 'error' ||
      results.length > 0);

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.panelHeader}>
        <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
          Choose {label}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close picker"
          hitSlop={8}
          onPress={() => {
            clear();
            setOpen(false);
          }}
        >
          <Text style={{ color: theme.colors.textMuted, fontWeight: '600' }}>
            Close
          </Text>
        </Pressable>
      </View>

      {todayLocation ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => pick(todayLocation)}
          style={[styles.row, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.rowTitle, { color: theme.colors.text }]}>
            Use Today location
          </Text>
          <Text style={{ color: theme.colors.textMuted }}>
            {todayLocation.name}
            {todayLocation.country ? ` · ${todayLocation.country}` : ''}
          </Text>
        </Pressable>
      ) : null}

      {favorites.length > 0 ? (
        <View>
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>
            Favorites
          </Text>
          {favorites.slice(0, 6).map((place) => (
            <PlaceRow
              key={place.id}
              title={place.name}
              meta={placeMeta(place)}
              onPress={() => pick(place)}
            />
          ))}
        </View>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={`Search city for ${label}`}
          placeholder="Search city"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          style={[styles.input, { color: theme.colors.text }]}
        />
        {status === 'loading' ? (
          <ActivityIndicator color={theme.colors.accent} />
        ) : null}
      </View>

      {showSearchPanel ? (
        <View>
          {status === 'error' && errorMessage ? (
            <Text style={{ color: theme.colors.danger }}>{errorMessage}</Text>
          ) : null}
          {status === 'empty' ? (
            <Text style={{ color: theme.colors.textMuted }}>
              No places found. Try another name.
            </Text>
          ) : null}
          {results.map((place) => (
            <PlaceRow
              key={place.id}
              title={place.name}
              meta={placeMeta(place)}
              onPress={() => pick(place)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PlaceRow({
  title,
  meta,
  onPress,
}: {
  title: string;
  meta: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.row, { borderColor: theme.colors.border }]}
    >
      <Text style={[styles.rowTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={{ color: theme.colors.textMuted }}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  choose: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  panel: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  row: {
    paddingVertical: 10,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
});
