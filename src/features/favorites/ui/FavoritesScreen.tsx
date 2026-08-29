import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/core/theme';
import type { WeatherLocation } from '@/features/weather';
import { EmptyState, Screen } from '@/shared/ui';

import { useFavoritesStore } from '../model/favoritesStore';

type FavoritesScreenProps = {
  onOpenLocation: (location: WeatherLocation) => Promise<void>;
};

export function FavoritesScreen({ onOpenLocation }: FavoritesScreenProps) {
  const theme = useAppTheme();
  const items = useFavoritesStore((state) => state.items);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const remove = useFavoritesStore((state) => state.remove);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openLocation = async (location: WeatherLocation) => {
    setOpeningId(location.id);
    setErrorMessage(null);
    try {
      await onOpenLocation(location);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not open this place.',
      );
    } finally {
      setOpeningId(null);
    }
  };

  const confirmRemove = (location: WeatherLocation) => {
    Alert.alert('Remove favorite?', location.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => remove(location.id),
      },
    ]);
  };

  if (!hasHydrated) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </Screen>
    );
  }

  if (items.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="Favorites"
          subtitle="Save a place from Today or the map to open it quickly later."
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { padding: theme.spacing.md },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        renderItem={({ item }) => (
          <FavoriteRow
            location={item}
            busy={openingId === item.id}
            disabled={openingId !== null}
            onOpen={() => void openLocation(item)}
            onRemove={() => confirmRemove(item)}
          />
        )}
        ListHeaderComponent={
          errorMessage ? (
            <Text
              style={[
                styles.error,
                { color: theme.colors.danger, marginBottom: theme.spacing.sm },
              ]}
            >
              {errorMessage}
            </Text>
          ) : null
        }
      />
    </Screen>
  );
}

type FavoriteRowProps = {
  location: WeatherLocation;
  busy: boolean;
  disabled: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

function FavoriteRow({
  location,
  busy,
  disabled,
  onOpen,
  onRemove,
}: FavoriteRowProps) {
  const theme = useAppTheme();
  const coords = `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: disabled && !busy ? 0.6 : 1,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onOpen}
        style={styles.cardBody}
      >
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {location.name}
        </Text>
        <Text style={{ color: theme.colors.textMuted }}>
          {[location.country, coords].filter(Boolean).join(' · ')}
        </Text>
      </Pressable>
      {busy ? (
        <ActivityIndicator color={theme.colors.accent} />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${location.name}`}
          disabled={disabled}
          hitSlop={8}
          onPress={onRemove}
          style={[styles.remove, { borderColor: theme.colors.border }]}
        >
          <Text style={{ color: theme.colors.danger, fontWeight: '600' }}>
            Remove
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    paddingBottom: 32,
  },
  error: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  remove: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
