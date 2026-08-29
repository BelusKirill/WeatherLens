import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  sanitizeThemePreference,
  type ThemePreference,
} from './themePreference';

type ThemePreferenceState = {
  preference: ThemePreference;
  /** False until AsyncStorage rehydrates persisted preference. */
  hasHydrated: boolean;
  setPreference: (preference: ThemePreference) => void;
};

const THEME_PREFERENCE_KEY = 'weatherlens.theme.preference';

export const useThemePreferenceStore = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      preference: 'system',
      hasHydrated: false,
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: THEME_PREFERENCE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preference: state.preference }),
      merge: (persisted, current) => ({
        ...current,
        preference: sanitizeThemePreference(
          persisted && typeof persisted === 'object'
            ? (persisted as { preference?: unknown }).preference
            : undefined,
        ),
      }),
      onRehydrateStorage: () => () => {
        useThemePreferenceStore.setState({ hasHydrated: true });
      },
    },
  ),
);
