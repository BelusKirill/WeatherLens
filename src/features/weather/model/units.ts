import type { TemperatureUnit } from './types';

/** All OpenWeather payloads in the store are kept in metric. */
export const STORAGE_UNIT: TemperatureUnit = 'metric';

const MPS_TO_MPH = 2.23693629;

/** °C → °F when display unit is imperial; otherwise identity. */
export function convertTempC(tempC: number, unit: TemperatureUnit): number {
  if (unit === 'imperial') {
    return (tempC * 9) / 5 + 32;
  }
  return tempC;
}

/** m/s → mph when display unit is imperial; otherwise identity. */
export function convertWindMs(speedMs: number, unit: TemperatureUnit): number {
  if (unit === 'imperial') {
    return speedMs * MPS_TO_MPH;
  }
  return speedMs;
}

export function windSpeedLabel(unit: TemperatureUnit): string {
  return unit === 'metric' ? 'm/s' : 'mph';
}

export function formatTempC(tempC: number, unit: TemperatureUnit): string {
  return `${Math.round(convertTempC(tempC, unit))}°`;
}
