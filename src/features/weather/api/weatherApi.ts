import { http } from '@/core/http';

import type { TemperatureUnit } from '../model/types';
import type { CurrentWeatherDto, ForecastDto } from './dto';
import { mapCurrentWeatherDto, mapForecastDto } from './mappers';

export type WeatherCoordsParams = {
  lat: number;
  lon: number;
  units: TemperatureUnit;
  signal?: AbortSignal;
  /** Display name when API returns empty city name (coords-only). */
  name?: string;
};

export async function fetchCurrentWeather(params: WeatherCoordsParams) {
  const { lat, lon, units, signal, name } = params;
  const { data } = await http.get<CurrentWeatherDto>('/data/2.5/weather', {
    params: { lat, lon, units },
    signal,
  });
  return mapCurrentWeatherDto(data, name);
}

export async function fetchForecast(params: WeatherCoordsParams) {
  const { lat, lon, units, signal } = params;
  const { data } = await http.get<ForecastDto>('/data/2.5/forecast', {
    params: { lat, lon, units },
    signal,
  });
  return mapForecastDto(data);
}

/** Current + next ~24h (8 × 3h slots) in one parallel request. */
export async function fetchWeatherBundle(params: WeatherCoordsParams) {
  const [current, hourly] = await Promise.all([
    fetchCurrentWeather(params),
    fetchForecast(params),
  ]);
  return { current, hourly };
}
