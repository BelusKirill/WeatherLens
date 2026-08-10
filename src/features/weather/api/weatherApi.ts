import { http } from '@/core/http';

import type { TemperatureUnit } from '../model/types';

/** Placeholder client — wire OpenWeather DTOs in Phase 1. */
export async function fetchCurrentWeather(params: {
  lat: number;
  lon: number;
  units: TemperatureUnit;
}) {
  const { data } = await http.get('/data/2.5/weather', { params });
  return data;
}
