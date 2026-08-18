import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/core/theme';
import type { WeatherLocation } from '@/features/weather';

import { useFavoritesStore } from '../model/favoritesStore';

type FavoriteToggleProps = {
  location: WeatherLocation | null;
  compact?: boolean;
};

export function FavoriteToggle({ location, compact = false }: FavoriteToggleProps) {
  const theme = useAppTheme();
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const saved = useFavoritesStore((state) =>
    location ? state.isFavorite(location) : false,
  );
  const add = useFavoritesStore((state) => state.add);
  const removeLocation = useFavoritesStore((state) => state.removeLocation);

  if (!location || !hasHydrated) {
    return null;
  }

  const onPress = () => {
    if (saved) {
      removeLocation(location);
      return;
    }
    add(location);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      onPress={onPress}
      style={[
        styles.button,
        compact && styles.compact,
        {
          backgroundColor: saved ? theme.colors.surface : theme.colors.accent,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text
        style={{
          color: saved ? theme.colors.text : '#FFFFFF',
          fontWeight: '600',
        }}
      >
        {saved ? 'Saved' : 'Save'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
