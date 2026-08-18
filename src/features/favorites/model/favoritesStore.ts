import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WeatherLocation } from '@/features/weather';

import { addFavorite, hasFavorite, isSameLocation, removeFavorite } from './favorites';

type FavoritesState = {
  items: WeatherLocation[];
  /** False until AsyncStorage rehydrates persisted `items`. */
  hasHydrated: boolean;
  add: (location: WeatherLocation) => void;
  remove: (id: string) => void;
  removeLocation: (location: WeatherLocation) => void;
  isFavorite: (location: WeatherLocation) => boolean;
};

const FAVORITES_STORAGE_KEY = 'weatherlens.favorites.items';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      add: (location) =>
        set((state) => ({ items: addFavorite(state.items, location) })),

      remove: (id) =>
        set((state) => ({ items: removeFavorite(state.items, id) })),

      removeLocation: (location) =>
        set((state) => ({
          items: state.items.filter((item) => !isSameLocation(item, location)),
        })),

      isFavorite: (location) => hasFavorite(get().items, location),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => () => {
        useFavoritesStore.setState({ hasHydrated: true });
      },
    },
  ),
);
