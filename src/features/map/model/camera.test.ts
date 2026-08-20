import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSameMapPoint } from './camera';

describe('isSameMapPoint', () => {
  it('treats nearby coordinates as the same place', () => {
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 51.5001, lon: -0.1201 }), true);
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 48.85, lon: 2.35 }), false);
  });
});
