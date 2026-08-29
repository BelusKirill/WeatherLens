import { create } from 'zustand';

import { isCanceledError } from '@/core/http/errors';
import type {
  CurrentWeather,
  HourlyPoint,
  WeatherLocation,
} from '@/features/weather';

export type CompareSlotId = 'a' | 'b';

type IdleSlot = {
  status: 'idle';
  location: null;
  current: null;
  hourly: HourlyPoint[];
  errorMessage: null;
};

type LoadingSlot = {
  status: 'loading';
  location: WeatherLocation;
  current: null;
  hourly: HourlyPoint[];
  errorMessage: null;
};

type ReadySlot = {
  status: 'ready';
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  errorMessage: null;
};

type ErrorSlot = {
  status: 'error';
  location: WeatherLocation;
  current: null;
  hourly: HourlyPoint[];
  errorMessage: string;
};

/**
 * Discriminated union keeps impossible combinations out of the UI:
 * ready always has weather; idle never has a location; error always has copy.
 */
export type CompareSlot = IdleSlot | LoadingSlot | ReadySlot | ErrorSlot;

type CompareState = {
  a: CompareSlot;
  b: CompareSlot;
  loadSlot: (id: CompareSlotId, location: WeatherLocation) => Promise<void>;
  clearSlot: (id: CompareSlotId) => void;
  retrySlot: (id: CompareSlotId) => Promise<void>;
  /** Abort only when Compare truly unmounts/resets; tab switches keep it mounted. */
  dispose: () => void;
};

type CompareFetcher = (params: {
  lat: number;
  lon: number;
  name?: string;
  signal?: AbortSignal;
}) => Promise<{ current: CurrentWeather; hourly: HourlyPoint[] }>;

type CompareStoreDependencies = {
  fetchBundle: CompareFetcher;
  toErrorMessage: (error: unknown) => string;
};

const emptySlot = (): IdleSlot => ({
  status: 'idle',
  location: null,
  current: null,
  hourly: [],
  errorMessage: null,
});

function withDisplayName(
  current: CurrentWeather,
  location: WeatherLocation,
): CurrentWeather {
  return {
    ...current,
    location: {
      ...current.location,
      name: location.name || current.location.name,
      country: location.country ?? current.location.country,
    },
  };
}

export function createCompareStore({
  fetchBundle,
  toErrorMessage,
}: CompareStoreDependencies) {
  const controllers: Record<CompareSlotId, AbortController | null> = {
    a: null,
    b: null,
  };

  const abortSlot = (id: CompareSlotId) => {
    controllers[id]?.abort();
    controllers[id] = null;
  };

  return create<CompareState>((set, get) => ({
    a: emptySlot(),
    b: emptySlot(),

    clearSlot: (id) => {
      abortSlot(id);
      set({ [id]: emptySlot() });
    },

    loadSlot: async (id, location) => {
      abortSlot(id);
      const controller = new AbortController();
      controllers[id] = controller;

      set({
        [id]: {
          status: 'loading',
          location,
          current: null,
          hourly: [],
          errorMessage: null,
        },
      });

      try {
        const { current, hourly } = await fetchBundle({
          lat: location.lat,
          lon: location.lon,
          name: location.name,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const nextCurrent = withDisplayName(current, location);

        set({
          [id]: {
            status: 'ready',
            location: nextCurrent.location,
            current: nextCurrent,
            hourly,
            errorMessage: null,
          },
        });
      } catch (error) {
        if (isCanceledError(error) || controller.signal.aborted) {
          return;
        }

        set({
          [id]: {
            status: 'error',
            location,
            current: null,
            hourly: [],
            errorMessage: toErrorMessage(error),
          },
        });
      } finally {
        if (controllers[id] === controller) {
          controllers[id] = null;
        }
      }
    },

    retrySlot: async (id) => {
      const slot = get()[id];
      if (slot.status === 'idle') {
        return;
      }
      await get().loadSlot(id, slot.location);
    },

    dispose: () => {
      abortSlot('a');
      abortSlot('b');
      set((state) => ({
        a: state.a.status === 'loading' ? emptySlot() : state.a,
        b: state.b.status === 'loading' ? emptySlot() : state.b,
      }));
    },
  }));
}
