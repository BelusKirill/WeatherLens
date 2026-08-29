import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { sanitizeThemePreference } from './themePreference';

describe('sanitizeThemePreference', () => {
  it('keeps supported preferences', () => {
    assert.equal(sanitizeThemePreference('system'), 'system');
    assert.equal(sanitizeThemePreference('light'), 'light');
    assert.equal(sanitizeThemePreference('dark'), 'dark');
  });

  it('falls back to system for missing or corrupt persisted values', () => {
    assert.equal(sanitizeThemePreference(undefined), 'system');
    assert.equal(sanitizeThemePreference('sepia'), 'system');
    assert.equal(sanitizeThemePreference({}), 'system');
  });
});
