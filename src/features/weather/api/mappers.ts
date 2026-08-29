import type {
  CurrentWeather,
  HourlyPoint,
  WeatherLocation,
} from '../model/types';
import type { CurrentWeatherDto, ForecastDto, GeoPlaceDto } from './dto';

const HOURLY_POINTS = 8;

export function mapGeoPlaceToLocation(place: GeoPlaceDto): WeatherLocation {
  return {
    id: locationId(place.lat, place.lon),
    name: place.state ? `${place.name}, ${place.state}` : place.name,
    country: place.country,
    lat: place.lat,
    lon: place.lon,
  };
}

function isGeoPlaceDto(value: unknown): value is GeoPlaceDto {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const place = value as Record<string, unknown>;
  return (
    typeof place.name === 'string' &&
    typeof place.lat === 'number' &&
    Number.isFinite(place.lat) &&
    typeof place.lon === 'number' &&
    Number.isFinite(place.lon)
  );
}

/** Accepts unknown JSON so a non-array payload cannot crash the UI. */
export function mapGeoPlaceList(data: unknown): WeatherLocation[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(isGeoPlaceDto).map(mapGeoPlaceToLocation);
}

export function mapCurrentWeatherDto(
  dto: CurrentWeatherDto,
  fallbackName?: string,
): CurrentWeather {
  const weather = dto.weather[0];

  return {
    location: {
      id: String(dto.id),
      name: dto.name || fallbackName || 'Selected location',
      country: dto.sys?.country,
      lat: dto.coord.lat,
      lon: dto.coord.lon,
    },
    temp: dto.main.temp,
    feelsLike: dto.main.feels_like,
    description: weather?.description ?? '',
    iconCode: weather?.icon ?? '01d',
    humidity: dto.main.humidity,
    windSpeed: dto.wind.speed,
    observedAt: dto.dt * 1000,
  };
}

export function mapForecastDto(dto: ForecastDto): HourlyPoint[] {
  return dto.list.slice(0, HOURLY_POINTS).map((item) => {
    const weather = item.weather[0];
    return {
      at: item.dt * 1000,
      temp: item.main.temp,
      iconCode: weather?.icon ?? '01d',
      description: weather?.description ?? '',
    };
  });
}

export function locationId(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}
