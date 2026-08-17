import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ApiError, NetworkError } from '../../../core/http/errors';
import { toUserWeatherMessage } from './errorMessage';

describe('toUserWeatherMessage', () => {
  it('returns a friendly network message', () => {
    assert.match(toUserWeatherMessage(new NetworkError()), /network/i);
  });

  it('special-cases auth and rate-limit API errors', () => {
    assert.match(toUserWeatherMessage(new ApiError('nope', 401)), /API key/i);
    assert.match(toUserWeatherMessage(new ApiError('nope', 429)), /Too many/i);
  });

  it('does not leak raw provider text for generic API errors', () => {
    const message = toUserWeatherMessage(
      new ApiError('cod 500 internal weirdness', 500),
    );
    assert.equal(message.includes('weirdness'), false);
    assert.match(message, /Could not load weather/i);
  });
});
