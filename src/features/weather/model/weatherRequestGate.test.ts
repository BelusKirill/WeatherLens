import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createWeatherRequestGate,
  DEDUPE_MS,
  weatherRequestKey,
} from './weatherRequestGate';

describe('weatherRequestKey', () => {
  it('rounds coords for stable dedupe keys', () => {
    assert.equal(
      weatherRequestKey(51.5074, -0.1278),
      weatherRequestKey(51.50741, -0.12779),
    );
    assert.notEqual(
      weatherRequestKey(51.5074, -0.1278),
      weatherRequestKey(51.6, -0.1278),
    );
  });
});

describe('WeatherRequestGate', () => {
  it('joins in-flight requests with the same key', async () => {
    const gate = createWeatherRequestGate();
    let runs = 0;

    const first = gate.begin('a', async () => {
      runs += 1;
      await new Promise((r) => setTimeout(r, 20));
    });
    const joined = gate.tryJoin('a');
    assert.ok(joined);
    await Promise.all([first, joined]);
    assert.equal(runs, 1);
  });

  it('skips fresh successes unless force is set', () => {
    const gate = createWeatherRequestGate();
    const now = 1_000_000;
    gate.markSuccess('london:metric', now);

    assert.equal(
      gate.shouldSkipAsFresh({
        key: 'london:metric',
        force: false,
        hasCurrent: true,
        now: now + 1_000,
      }),
      true,
    );
    assert.equal(
      gate.shouldSkipAsFresh({
        key: 'london:metric',
        force: true,
        hasCurrent: true,
        now: now + 1_000,
      }),
      false,
    );
    assert.equal(
      gate.shouldSkipAsFresh({
        key: 'london:metric',
        force: false,
        hasCurrent: true,
        now: now + DEDUPE_MS + 1,
      }),
      false,
    );
  });

  it('aborts the previous begin when a new key starts', async () => {
    const gate = createWeatherRequestGate();
    let firstAborted = false;

    const first = gate.begin('one', async (signal) => {
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 100);
        signal.addEventListener('abort', () => {
          firstAborted = true;
          clearTimeout(timer);
          resolve();
        });
      });
    });

    await gate.begin('two', async () => {
      /* immediate */
    });
    await first;
    assert.equal(firstAborted, true);
  });

  it('reset clears bootstrap and success memory', () => {
    const gate = createWeatherRequestGate();
    gate.markSuccess('x', Date.now());
    gate.setBootstrap(Promise.resolve());
    gate.reset();
    assert.equal(gate.getBootstrap(), null);
    assert.equal(
      gate.shouldSkipAsFresh({
        key: 'x',
        force: false,
        hasCurrent: true,
      }),
      false,
    );
  });
});
