export const FALLBACK_PIN = {
  lat: 51.5074,
  lon: -0.1278,
  title: 'London',
} as const;

export type MapPin = {
  lat: number;
  lon: number;
  title: string;
};

export function isSameMapPoint(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): boolean {
  return Math.abs(a.lat - b.lat) < 0.0002 && Math.abs(a.lon - b.lon) < 0.0002;
}

/** After a tap/search, keep the pin on the gesture; only refresh the label. */
export function pinAfterLocationSync(
  current: MapPin,
  selected: { lat: number; lon: number; name: string },
  keepUserPoint: boolean,
): MapPin {
  if (keepUserPoint) {
    return { ...current, title: selected.name };
  }
  return {
    lat: selected.lat,
    lon: selected.lon,
    title: selected.name,
  };
}
