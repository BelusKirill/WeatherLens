import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppTheme } from '@/core/theme';
import type { WeatherLocation } from '@/features/weather';

import type { PlaceSearchStatus } from '../model/useMapScreen';

type CitySearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  results: WeatherLocation[];
  status: PlaceSearchStatus;
  errorMessage: string | null;
  onSelect: (place: WeatherLocation) => void;
  onClear: () => void;
};

export function CitySearch({
  query,
  onQueryChange,
  results,
  status,
  errorMessage,
  onSelect,
  onClear,
}: CitySearchProps) {
  const theme = useAppTheme();
  const showPanel =
    query.trim().length >= 2 &&
    (status === 'loading' ||
      status === 'empty' ||
      status === 'error' ||
      results.length > 0);

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel="Search city"
          placeholder="Search city"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={onQueryChange}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          style={[styles.input, { color: theme.colors.text }]}
        />
        {status === 'loading' ? (
          <ActivityIndicator color={theme.colors.accent} />
        ) : query.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={onClear}
          >
            <Text style={{ color: theme.colors.textMuted, fontWeight: '600' }}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>

      {showPanel ? (
        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {status === 'error' && errorMessage ? (
            <Text style={{ color: theme.colors.danger }}>{errorMessage}</Text>
          ) : null}
          {status === 'empty' ? (
            <Text style={{ color: theme.colors.textMuted }}>
              No places found. Try another name.
            </Text>
          ) : null}
          {results.map((place) => (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              onPress={() => onSelect(place)}
              style={[styles.row, { borderColor: theme.colors.border }]}
            >
              <Text style={[styles.placeName, { color: theme.colors.text }]}>
                {place.name}
              </Text>
              <Text style={{ color: theme.colors.textMuted }}>
                {[place.country, `${place.lat.toFixed(2)}, ${place.lon.toFixed(2)}`]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  panel: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    maxHeight: 240,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
  },
});
