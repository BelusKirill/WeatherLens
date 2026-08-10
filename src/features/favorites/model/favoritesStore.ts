import { create } from 'zustand';

import type { WeatherLocation } from '@/features/weather';

type FavoritesState = {
  items: WeatherLocation[];
  add: (location: WeatherLocation) => void;
  remove: (id: string) => void;
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  items: [],
  add: (location) =>
    set((state) => {
      if (state.items.some((item) => item.id === location.id)) {
        return state;
      }
      return { items: [...state.items, location] };
    }),
  remove: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));
