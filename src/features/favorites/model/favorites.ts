import type { WeatherLocation } from '@/features/weather';

/** Same place if ids match or coordinates agree to ~100 m. */
export function isSameLocation(
  a: WeatherLocation,
  b: WeatherLocation,
): boolean {
  if (a.id === b.id) {
    return true;
  }
  return a.lat.toFixed(3) === b.lat.toFixed(3) && a.lon.toFixed(3) === b.lon.toFixed(3);
}

export function hasFavorite(
  items: WeatherLocation[],
  location: WeatherLocation,
): boolean {
  return items.some((item) => isSameLocation(item, location));
}

export function addFavorite(
  items: WeatherLocation[],
  location: WeatherLocation,
): WeatherLocation[] {
  if (hasFavorite(items, location)) {
    return items;
  }
  return [...items, location];
}

export function removeFavorite(
  items: WeatherLocation[],
  id: string,
): WeatherLocation[] {
  return items.filter((item) => item.id !== id);
}

export function sanitizeFavorites(value: unknown): WeatherLocation[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const items: WeatherLocation[] = [];
  for (const entry of value) {
    if (!isPersistedLocation(entry)) {
      continue;
    }
    items.push(entry);
  }
  return items;
}

function isPersistedLocation(value: unknown): value is WeatherLocation {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const location = value as Record<string, unknown>;
  return (
    typeof location.id === 'string' &&
    typeof location.name === 'string' &&
    typeof location.lat === 'number' &&
    Number.isFinite(location.lat) &&
    typeof location.lon === 'number' &&
    Number.isFinite(location.lon) &&
    (location.country === undefined || typeof location.country === 'string')
  );
}
