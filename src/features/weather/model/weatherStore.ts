import { create } from 'zustand';

import type {
  CurrentWeather,
  HourlyPoint,
  TemperatureUnit,
  WeatherLocation,
} from './types';

type WeatherState = {
  unit: TemperatureUnit;
  selectedLocation: WeatherLocation | null;
  current: CurrentWeather | null;
  hourly: HourlyPoint[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage: string | null;
  setUnit: (unit: TemperatureUnit) => void;
  setSelectedLocation: (location: WeatherLocation | null) => void;
  setForecast: (current: CurrentWeather, hourly: HourlyPoint[]) => void;
  setLoading: () => void;
  setError: (message: string) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  unit: 'metric',
  selectedLocation: null,
  current: null,
  hourly: [],
  status: 'idle',
  errorMessage: null,
  setUnit: (unit) => set({ unit }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setForecast: (current, hourly) =>
    set({ current, hourly, status: 'ready', errorMessage: null }),
  setLoading: () => set({ status: 'loading', errorMessage: null }),
  setError: (errorMessage) => set({ status: 'error', errorMessage }),
}));
