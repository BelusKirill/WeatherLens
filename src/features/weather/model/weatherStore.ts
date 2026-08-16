import { create } from 'zustand';

import { isCanceledError } from '@/core/http/errors';
import {
  getCurrentPosition,
  type CurrentPositionResult,
} from '@/features/location';

import { fetchWeatherBundle } from '../api/weatherApi';
import { toUserWeatherMessage } from './errorMessage';
import type {
  CurrentWeather,
  HourlyPoint,
  TemperatureUnit,
  WeatherLocation,
} from './types';

type LoadWeatherArgs = {
  lat: number;
  lon: number;
  name?: string;
  /** When set, committed only after a successful fetch (avoids unit/data mismatch). */
  units?: TemperatureUnit;
};

type EmptyReason = 'denied' | 'services_off' | 'unavailable' | 'generic';

type WeatherState = {
  unit: TemperatureUnit;
  selectedLocation: WeatherLocation | null;
  current: CurrentWeather | null;
  hourly: HourlyPoint[];
  status: 'idle' | 'loading' | 'ready' | 'error' | 'empty';
  errorMessage: string | null;
  emptyMessage: string | null;
  emptyReason: EmptyReason | null;
  setSelectedLocation: (location: WeatherLocation | null) => void;
  setForecast: (
    current: CurrentWeather,
    hourly: HourlyPoint[],
    unit?: TemperatureUnit,
  ) => void;
  setLoading: () => void;
  setError: (message: string) => void;
  setEmpty: (message: string, reason?: EmptyReason) => void;
  /** Updates unit; reloads forecast when a location is already selected. */
  changeUnit: (unit: TemperatureUnit) => Promise<void>;
  loadWeather: (args: LoadWeatherArgs) => Promise<void>;
  toggleUnit: () => Promise<void>;
  /** One-shot app start: GPS → weather. Safe under Strict Mode / remounts. */
  bootstrapFromDevice: () => Promise<void>;
  loadDemoLondon: () => Promise<void>;
};

const DEMO_LOCATION = {
  lat: 51.5074,
  lon: -0.1278,
  name: 'London',
} as const;

/** Skip duplicate loads for the same place/units within this window. */
const DEDUPE_MS = 15_000;

let activeController: AbortController | null = null;
let inFlightKey: string | null = null;
let inFlightPromise: Promise<void> | null = null;
let lastSuccessKey: string | null = null;
let lastSuccessAt = 0;
let bootstrapPromise: Promise<void> | null = null;

function requestKey(lat: number, lon: number, units: TemperatureUnit): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)},${units}`;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  unit: 'metric',
  selectedLocation: null,
  current: null,
  hourly: [],
  status: 'idle',
  errorMessage: null,
  emptyMessage: null,
  emptyReason: null,

  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

  setForecast: (current, hourly, unit) =>
    set({
      current,
      hourly,
      selectedLocation: current.location,
      status: 'ready',
      errorMessage: null,
      emptyMessage: null,
      emptyReason: null,
      ...(unit ? { unit } : {}),
    }),

  setLoading: () =>
    set({
      status: 'loading',
      errorMessage: null,
      emptyMessage: null,
      emptyReason: null,
    }),

  setError: (errorMessage) =>
    set({ status: 'error', errorMessage, emptyMessage: null, emptyReason: null }),

  setEmpty: (emptyMessage, reason = 'generic') =>
    set({
      status: 'empty',
      emptyMessage,
      emptyReason: reason,
      errorMessage: null,
      current: null,
      hourly: [],
    }),

  loadWeather: async ({ lat, lon, name, units }) => {
    const effectiveUnits = units ?? get().unit;
    const key = requestKey(lat, lon, effectiveUnits);

    // Same request already in flight → join it (no extra HTTP).
    if (inFlightKey === key && inFlightPromise) {
      return inFlightPromise;
    }

    // Fresh success for same place/units → skip (stops remount / Strict Mode spam).
    if (
      lastSuccessKey === key &&
      Date.now() - lastSuccessAt < DEDUPE_MS &&
      get().current
    ) {
      set({ status: 'ready', errorMessage: null });
      return;
    }

    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;

    const run = (async () => {
      get().setLoading();

      try {
        const { current, hourly } = await fetchWeatherBundle({
          lat,
          lon,
          units: effectiveUnits,
          signal: controller.signal,
          name,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (name && current.location.name === 'Selected location') {
          current.location = { ...current.location, name };
        }

        lastSuccessKey = key;
        lastSuccessAt = Date.now();
        get().setForecast(current, hourly, effectiveUnits);
      } catch (error) {
        if (isCanceledError(error) || controller.signal.aborted) {
          // Superseded by a newer load — leave state to the winner.
          return;
        }
        get().setError(toUserWeatherMessage(error));
      } finally {
        if (activeController === controller) {
          activeController = null;
        }
        if (inFlightKey === key) {
          inFlightKey = null;
          inFlightPromise = null;
        }
      }
    })();

    inFlightKey = key;
    inFlightPromise = run;
    return run;
  },

  changeUnit: async (unit) => {
    const state = get();
    if (state.unit === unit) {
      return;
    }

    const loc = state.selectedLocation ?? state.current?.location;
    if (!loc) {
      set({ unit });
      return;
    }

    await state.loadWeather({
      lat: loc.lat,
      lon: loc.lon,
      name: loc.name,
      units: unit,
    });
  },

  toggleUnit: async () => {
    const { unit, changeUnit } = get();
    const next: TemperatureUnit = unit === 'metric' ? 'imperial' : 'metric';
    await changeUnit(next);
  },

  bootstrapFromDevice: async () => {
    if (bootstrapPromise) {
      return bootstrapPromise;
    }

    const state = get();
    if (state.status === 'ready' && state.current) {
      return;
    }
    if (state.status === 'loading') {
      return inFlightPromise ?? undefined;
    }

    bootstrapPromise = (async () => {
      get().setLoading();

      let result: CurrentPositionResult;
      try {
        result = await getCurrentPosition();
      } catch {
        get().setEmpty('Could not read your current position. Try again.', 'unavailable');
        return;
      }

      if (!result.ok) {
        get().setEmpty(result.message, result.reason);
        return;
      }

      await get().loadWeather({
        lat: result.coords.lat,
        lon: result.coords.lon,
      });
    })().finally(() => {
      // Allow manual retry after a finished bootstrap attempt.
      bootstrapPromise = null;
    });

    return bootstrapPromise;
  },

  loadDemoLondon: async () => {
    await get().loadWeather({
      lat: DEMO_LOCATION.lat,
      lon: DEMO_LOCATION.lon,
      name: DEMO_LOCATION.name,
    });
  },
}));
