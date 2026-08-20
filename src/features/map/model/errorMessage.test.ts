import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ApiError, NetworkError } from '../../../core/http/errors';
import { toUserMapMessage } from './errorMessage';

describe('toUserMapMessage', () => {
  it('returns a friendly network message', () => {
    assert.match(toUserMapMessage(new NetworkError(), 'search'), /network/i);
  });

  it('special-cases auth and rate-limit API errors', () => {
    assert.match(toUserMapMessage(new ApiError('nope', 401), 'search'), /API key/i);
    assert.match(toUserMapMessage(new ApiError('nope', 429), 'geocode'), /Too many/i);
  });

  it('does not leak raw provider text', () => {
    const message = toUserMapMessage(
      new ApiError('cod 500 internal weirdness', 500),
      'search',
    );
    assert.equal(message.includes('weirdness'), false);
    assert.match(message, /Could not search places/i);
  });
});
