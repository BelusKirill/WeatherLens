import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CurrentWeatherDto, ForecastDto, GeoPlaceDto } from './dto';
import {
  locationId,
  mapCurrentWeatherDto,
  mapForecastDto,
  mapGeoPlaceToLocation,
} from './mappers';

describe('mapCurrentWeatherDto', () => {
  const base: CurrentWeatherDto = {
    id: 2643743,
    name: 'London',
    coord: { lat: 51.51, lon: -0.13 },
    weather: [
      { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    ],
    main: { temp: 18.4, feels_like: 17.1, humidity: 55 },
    wind: { speed: 3.2 },
    sys: { country: 'GB' },
    dt: 1_700_000_000,
  };

  it('maps domain fields from the OpenWeather payload', () => {
    const current = mapCurrentWeatherDto(base);
    assert.equal(current.location.name, 'London');
    assert.equal(current.location.country, 'GB');
    assert.equal(current.temp, 18.4);
    assert.equal(current.feelsLike, 17.1);
    assert.equal(current.iconCode, '01d');
    assert.equal(current.observedAt, 1_700_000_000_000);
  });

  it('uses fallback name when API city name is empty', () => {
    const current = mapCurrentWeatherDto({ ...base, name: '' }, 'Demo');
    assert.equal(current.location.name, 'Demo');
  });
});

describe('mapForecastDto', () => {
  it('keeps the first eight 3-hour points', () => {
    const dto: ForecastDto = {
      city: {
        id: 1,
        name: 'London',
        country: 'GB',
        coord: { lat: 1, lon: 2 },
      },
      list: Array.from({ length: 12 }, (_, index) => ({
        dt: 1_700_000_000 + index * 10_800,
        main: { temp: 10 + index },
        weather: [{ description: 'clouds', icon: '03d' }],
      })),
    };

    const hourly = mapForecastDto(dto);
    assert.equal(hourly.length, 8);
    assert.equal(hourly[0]?.temp, 10);
    assert.equal(hourly[7]?.temp, 17);
    assert.equal(hourly[0]?.at, 1_700_000_000_000);
  });
});

describe('mapGeoPlaceToLocation', () => {
  it('builds a stable id and optional state label', () => {
    const place: GeoPlaceDto = {
      name: 'Austin',
      lat: 30.2672,
      lon: -97.7431,
      country: 'US',
      state: 'Texas',
    };

    const location = mapGeoPlaceToLocation(place);
    assert.equal(location.id, locationId(30.2672, -97.7431));
    assert.equal(location.name, 'Austin, Texas');
    assert.equal(location.country, 'US');
  });
});
