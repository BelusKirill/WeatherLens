import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { pinAfterLocationSync, isSameMapPoint } from './camera';

describe('pinAfterLocationSync', () => {
  const tap = { lat: 51.5, lon: -0.12, title: 'Selected place' };
  const station = { lat: 51.51, lon: -0.13, name: 'London' };

  it('keeps tap coordinates and only updates the title', () => {
    const next = pinAfterLocationSync(tap, station, true);
    assert.equal(next.lat, tap.lat);
    assert.equal(next.lon, tap.lon);
    assert.equal(next.title, 'London');
  });

  it('moves the pin for external selection (favorites)', () => {
    const next = pinAfterLocationSync(tap, station, false);
    assert.equal(next.lat, station.lat);
    assert.equal(next.lon, station.lon);
    assert.equal(next.title, 'London');
  });
});

describe('isSameMapPoint', () => {
  it('treats nearby coordinates as the same place', () => {
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 51.5001, lon: -0.1201 }), true);
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 48.85, lon: 2.35 }), false);
  });
});
