import { http } from '@/core/http';

import type { WeatherLocation } from '../model/types';
import type { GeoPlaceDto } from './dto';
import { mapGeoPlaceList } from './mappers';

export async function searchPlaces(
  query: string,
  options?: { limit?: number; signal?: AbortSignal },
): Promise<WeatherLocation[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  const { data } = await http.get<GeoPlaceDto[]>('/geo/1.0/direct', {
    params: { q, limit: options?.limit ?? 5 },
    signal: options?.signal,
  });

  return mapGeoPlaceList(data);
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  options?: { signal?: AbortSignal },
): Promise<WeatherLocation | null> {
  const { data } = await http.get<GeoPlaceDto[]>('/geo/1.0/reverse', {
    params: { lat, lon, limit: 1 },
    signal: options?.signal,
  });

  const places = mapGeoPlaceList(data);
  return places[0] ?? null;
}
