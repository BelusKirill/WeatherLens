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
