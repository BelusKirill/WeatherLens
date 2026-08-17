import { http } from '@/core/http';

import { STORAGE_UNIT } from '../model/units';
import type { CurrentWeatherDto, ForecastDto } from './dto';
import { mapCurrentWeatherDto, mapForecastDto } from './mappers';

export type WeatherCoordsParams = {
  lat: number;
  lon: number;
  signal?: AbortSignal;
  /** Display name when API returns empty city name (coords-only). */
  name?: string;
};

async function fetchCurrentWeather(params: WeatherCoordsParams) {
  const { lat, lon, signal, name } = params;
  const { data } = await http.get<CurrentWeatherDto>('/data/2.5/weather', {
    params: { lat, lon, units: STORAGE_UNIT },
    signal,
  });
  return mapCurrentWeatherDto(data, name);
}

async function fetchForecast(params: WeatherCoordsParams) {
  const { lat, lon, signal } = params;
  const { data } = await http.get<ForecastDto>('/data/2.5/forecast', {
    params: { lat, lon, units: STORAGE_UNIT },
    signal,
  });
  return mapForecastDto(data);
}

/** Current + next ~24h (8 × 3h slots) in one parallel request (always metric). */
export async function fetchWeatherBundle(params: WeatherCoordsParams) {
  const [current, hourly] = await Promise.all([
    fetchCurrentWeather(params),
    fetchForecast(params),
  ]);
  return { current, hourly };
}
