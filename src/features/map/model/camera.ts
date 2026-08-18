export const FALLBACK_PIN = {
  lat: 51.5074,
  lon: -0.1278,
  title: 'London',
} as const;

export const DEFAULT_DELTA = 0.12;

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

export function regionFromPin(pin: Pick<MapPin, 'lat' | 'lon'>) {
  return {
    latitude: pin.lat,
    longitude: pin.lon,
    latitudeDelta: DEFAULT_DELTA,
    longitudeDelta: DEFAULT_DELTA,
  };
}
