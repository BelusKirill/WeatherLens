import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { convertTempC, convertWindMs, formatTempC } from './units';

describe('units conversion', () => {
  it('keeps metric temps and wind unchanged', () => {
    assert.equal(convertTempC(20, 'metric'), 20);
    assert.equal(convertWindMs(5, 'metric'), 5);
    assert.equal(formatTempC(20.4, 'metric'), '20°');
  });

  it('converts to imperial for display', () => {
    assert.equal(convertTempC(0, 'imperial'), 32);
    assert.equal(convertTempC(100, 'imperial'), 212);
    assert.ok(Math.abs(convertWindMs(1, 'imperial') - 2.23693629) < 1e-6);
    assert.equal(formatTempC(0, 'imperial'), '32°');
  });
});
