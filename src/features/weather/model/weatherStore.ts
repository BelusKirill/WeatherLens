import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isCanceledError } from '@/core/http/errors';
import {
  getCurrentPosition,
  type CurrentPositionResult,
} from '@/features/location';

import { fetchWeatherBundle } from '../api/weatherApi';
import { toUserWeatherMessage } from './errorMessage';
import { shouldApplyDeviceFix } from './selection';
import type {
  CurrentWeather,
  HourlyPoint,
  TemperatureUnit,
  WeatherLocation,
} from './types';
import {
  weatherRequestGate,
  weatherRequestKey,
} from './weatherRequestGate';

type LoadWeatherArgs = {
  lat: number;
  lon: number;
  name?: string;
  /** Bypass remount dedupe — use for explicit Retry / pull-to-refresh. */
  force?: boolean;
  /** `user` wins over in-flight GPS bootstrap (map / search / favorites). */
  source?: 'user' | 'device';
};

type EmptyReason =
  | 'denied'
  | 'services_off'
  | 'unavailable'
  | 'timeout'
  | 'generic';

type WeatherState = {
  /** Display preference only — forecast payloads stay metric in `current` / `hourly`. */
  unit: TemperatureUnit;
  /** False until AsyncStorage rehydrates persisted `unit` (avoids °C→°F flash). */
  hasHydratedUnit: boolean;
  selectedLocation: WeatherLocation | null;
  current: CurrentWeather | null;
  hourly: HourlyPoint[];
  status: 'idle' | 'loading' | 'ready' | 'error' | 'empty';
  errorMessage: string | null;
  emptyMessage: string | null;
  emptyReason: EmptyReason | null;
  userPickedPlace: boolean;
  noteUserSelection: () => void;
  setSelectedLocation: (location: WeatherLocation | null) => void;
  setForecast: (current: CurrentWeather, hourly: HourlyPoint[]) => void;
  setLoading: () => void;
  setError: (message: string) => void;
  setEmpty: (message: string, reason?: EmptyReason) => void;
  /** Instant local preference — no network; persisted across app restarts. */
  changeUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  loadWeather: (args: LoadWeatherArgs) => Promise<void>;
  bootstrapFromDevice: (options?: { force?: boolean }) => Promise<void>;
  loadDemoLondon: () => Promise<void>;
};

const DEMO_LOCATION = {
  lat: 51.5074,
  lon: -0.1278,
  name: 'London',
} as const;

const UNIT_STORAGE_KEY = 'weatherlens.weather.unit';

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      unit: 'metric',
      hasHydratedUnit: false,
      selectedLocation: null,
      current: null,
      hourly: [],
      status: 'idle',
      errorMessage: null,
      emptyMessage: null,
      emptyReason: null,
      userPickedPlace: false,

      noteUserSelection: () => set({ userPickedPlace: true }),

      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

      setForecast: (current, hourly) =>
        set({
          current,
          hourly,
          selectedLocation: current.location,
          status: 'ready',
          errorMessage: null,
          emptyMessage: null,
          emptyReason: null,
        }),

      setLoading: () =>
        set({
          status: 'loading',
          errorMessage: null,
          emptyMessage: null,
          emptyReason: null,
        }),

      setError: (errorMessage) =>
        set({
          status: 'error',
          errorMessage,
          emptyMessage: null,
          emptyReason: null,
        }),

      setEmpty: (emptyMessage, reason = 'generic') =>
        set({
          status: 'empty',
          emptyMessage,
          emptyReason: reason,
          errorMessage: null,
          current: null,
          hourly: [],
          selectedLocation: null,
          userPickedPlace: false,
        }),

      changeUnit: (unit) => {
        if (get().unit === unit) {
          return;
        }
        set({ unit });
      },

      toggleUnit: () => {
        const next: TemperatureUnit =
          get().unit === 'metric' ? 'imperial' : 'metric';
        set({ unit: next });
      },

      loadWeather: async ({ lat, lon, name, force = false, source = 'user' }) => {
        if (source === 'user') {
          get().noteUserSelection();
        }

        const key = weatherRequestKey(lat, lon);

        const joined = weatherRequestGate.tryJoin(key);
        if (joined) {
          return joined;
        }

        if (
          weatherRequestGate.shouldSkipAsFresh({
            key,
            force,
            hasCurrent: Boolean(get().current),
          })
        ) {
          set({ status: 'ready', errorMessage: null });
          return;
        }

        return weatherRequestGate.begin(key, async (signal) => {
          if (get().status !== 'loading') {
            get().setLoading();
          }

          try {
            const { current, hourly } = await fetchWeatherBundle({
              lat,
              lon,
              signal,
              name,
            });

            if (signal.aborted) {
              return;
            }

            const nextCurrent =
              name && current.location.name === 'Selected location'
                ? {
                    ...current,
                    location: { ...current.location, name },
                  }
                : current;

            weatherRequestGate.markSuccess(key);
            get().setForecast(nextCurrent, hourly);
          } catch (error) {
            if (isCanceledError(error) || signal.aborted) {
              return;
            }
            get().setError(toUserWeatherMessage(error));
          }
        });
      },

      bootstrapFromDevice: async (options) => {
        const force = options?.force ?? false;

        const inFlightBootstrap = weatherRequestGate.getBootstrap();
        if (inFlightBootstrap) {
          return inFlightBootstrap;
        }

        const state = get();
        if (!shouldApplyDeviceFix(state.userPickedPlace)) {
          return;
        }
        if (
          !force &&
          state.current &&
          (state.status === 'ready' || state.status === 'loading')
        ) {
          return;
        }

        const bootstrap = (async () => {
          const gpsStillOwns = () => shouldApplyDeviceFix(get().userPickedPlace);
          if (!gpsStillOwns()) {
            return;
          }

          get().setLoading();

          let result: CurrentPositionResult;
          try {
            result = await getCurrentPosition();
          } catch {
            if (gpsStillOwns()) {
              get().setEmpty(
                'Could not read your current position. Try again.',
                'unavailable',
              );
            }
            return;
          }

          if (!result.ok) {
            if (gpsStillOwns()) {
              get().setEmpty(result.message, result.reason);
            }
            return;
          }

          if (!gpsStillOwns()) {
            return;
          }

          await get().loadWeather({
            lat: result.coords.lat,
            lon: result.coords.lon,
            force,
            source: 'device',
          });
        })().finally(() => {
          weatherRequestGate.setBootstrap(null);
        });

        weatherRequestGate.setBootstrap(bootstrap);
        return bootstrap;
      },

      loadDemoLondon: async () => {
        await get().loadWeather({
          lat: DEMO_LOCATION.lat,
          lon: DEMO_LOCATION.lon,
          name: DEMO_LOCATION.name,
          force: true,
        });
      },
    }),
    {
      name: UNIT_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ unit: state.unit }),
      onRehydrateStorage: () => (_state, _error) => {
        useWeatherStore.setState({ hasHydratedUnit: true });
      },
    },
  ),
);
