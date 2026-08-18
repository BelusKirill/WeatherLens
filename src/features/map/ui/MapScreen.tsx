import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { isApiKeyConfigured } from '@/core/config';
import { useAppTheme } from '@/core/theme';
import { FavoriteToggle } from '@/features/favorites';
import { EmptyState, Screen } from '@/shared/ui';

import { useMapScreen } from '../model/useMapScreen';
import { CitySearch } from './CitySearch';
import { MapCanvas } from './MapCanvas';

export function MapScreen() {
  const theme = useAppTheme();
  const {
    pin,
    banner,
    selectedLocation,
    weatherStatus,
    query,
    setQuery,
    results,
    searchStatus,
    searchError,
    onPickPlace,
    retryPinWeather,
    selectPlace,
    clearSearch,
  } = useMapScreen();

  if (!isApiKeyConfigured()) {
    return (
      <Screen>
        <EmptyState
          title="Configure API key"
          subtitle="Copy .env.example to .env and set EXPO_PUBLIC_OPENWEATHER_API_KEY."
        />
      </Screen>
    );
  }

  const saveLocation =
    weatherStatus === 'ready' && selectedLocation ? selectedLocation : null;

  return (
    <Screen padded={false}>
      <View style={styles.root}>
        <View collapsable={false} style={styles.mapHost}>
          <MapCanvas
            pin={pin}
            onPick={onPickPlace}
          />
        </View>

        <View
          pointerEvents="box-none"
          style={[styles.top, { padding: theme.spacing.md }]}
        >
          <CitySearch
            query={query}
            onQueryChange={setQuery}
            results={results}
            status={searchStatus}
            errorMessage={searchError}
            onSelect={selectPlace}
            onClear={clearSearch}
          />
          <Text
            style={[
              styles.hint,
              {
                color: theme.colors.textMuted,
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            Tap the map to load weather for that place
          </Text>
        </View>

        <View
          style={[
            styles.bottomSheet,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View
            style={[
              styles.placeBar,
              {
                backgroundColor: theme.colors.surface,
                borderColor:
                  banner.kind === 'error' ? theme.colors.danger : theme.colors.border,
              },
            ]}
          >
            <View style={styles.placeMeta}>
              <Text style={[styles.placeName, { color: theme.colors.text }]}>
                {pin.title}
              </Text>
              <View style={styles.statusRow}>
                {banner.kind === 'info' ? (
                  <ActivityIndicator size="small" color={theme.colors.accent} />
                ) : null}
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    color:
                      banner.kind === 'error'
                        ? theme.colors.danger
                        : theme.colors.textMuted,
                  }}
                >
                  {banner.kind === 'hidden'
                    ? `${pin.lat.toFixed(2)}, ${pin.lon.toFixed(2)}`
                    : banner.message}
                </Text>
                {banner.kind === 'error' ? (
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => void retryPinWeather()}
                  >
                    <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>
                      Retry
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <FavoriteToggle location={saveLocation} compact />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapHost: {
    flex: 1,
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    gap: 8,
  },
  hint: {
    alignSelf: 'flex-start',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 50,
  },
  placeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  placeMeta: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 20,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
  },
});
