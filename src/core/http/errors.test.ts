import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import axios from 'axios';

import {
  ApiError,
  isCanceledError,
  NetworkError,
  toAppError,
} from './errors';

describe('toAppError', () => {
  it('maps network failures to NetworkError', () => {
    const error = new axios.AxiosError('Network Error', 'ERR_NETWORK');
    const mapped = toAppError(error);
    assert.ok(mapped instanceof NetworkError);
  });

  it('maps HTTP payloads to ApiError with status', () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Invalid API key' },
      },
    );

    const mapped = toAppError(error);
    assert.ok(mapped instanceof ApiError);
    assert.equal(mapped.status, 401);
    assert.equal(mapped.message, 'Invalid API key');
  });

  it('preserves cancel errors for callers that must ignore them', () => {
    const cancel = new axios.CanceledError('canceled');
    assert.equal(isCanceledError(cancel), true);
    const mapped = toAppError(cancel);
    assert.equal(isCanceledError(mapped), true);
  });
});
