import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { shouldApplyDeviceFix } from './selection';

describe('shouldApplyDeviceFix', () => {
  it('allows GPS weather until the user picks a place', () => {
    assert.equal(shouldApplyDeviceFix(false), true);
  });

  it('blocks GPS weather after a user pick / search / favorite', () => {
    assert.equal(shouldApplyDeviceFix(true), false);
  });
});
