import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { WeatherLocation } from '../../weather/model/types';

import {
  addFavorite,
  hasFavorite,
  isSameLocation,
  removeFavorite,
} from './favorites';

const london: WeatherLocation = {
  id: '2643743',
  name: 'London',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
};

const londonGeo: WeatherLocation = {
  id: '51.5074,-0.1278',
  name: 'London',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
};

const paris: WeatherLocation = {
  id: '2988507',
  name: 'Paris',
  country: 'FR',
  lat: 48.8566,
  lon: 2.3522,
};

describe('isSameLocation', () => {
  it('matches by id', () => {
    assert.equal(isSameLocation(london, { ...london, name: 'City of London' }), true);
  });

  it('matches nearby coordinates even when ids differ', () => {
    assert.equal(isSameLocation(london, londonGeo), true);
  });

  it('does not match distinct cities', () => {
    assert.equal(isSameLocation(london, paris), false);
  });
});

describe('addFavorite / removeFavorite', () => {
  it('dedupes by coordinates', () => {
    const once = addFavorite([], london);
    const twice = addFavorite(once, londonGeo);
    assert.equal(twice.length, 1);
    assert.equal(hasFavorite(twice, londonGeo), true);
  });

  it('appends a new city and removes by id', () => {
    const withParis = addFavorite([london], paris);
    assert.equal(withParis.length, 2);
    assert.deepEqual(removeFavorite(withParis, paris.id), [london]);
  });
});
