import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { NetworkError } from '@/core/http/errors';
import type {
  CurrentWeather,
  HourlyPoint,
  WeatherLocation,
} from '@/features/weather';

import { createCompareStore } from './compareStoreCore';

const london: WeatherLocation = {
  id: 'london',
  name: 'London',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
};

const paris: WeatherLocation = {
  id: 'paris',
  name: 'Paris',
  country: 'FR',
  lat: 48.8566,
  lon: 2.3522,
};

function bundle(location: WeatherLocation, temp: number) {
  const current: CurrentWeather = {
    location,
    temp,
    feelsLike: temp - 1,
    description: 'clear sky',
    iconCode: '01d',
    humidity: 50,
    windSpeed: 2,
    observedAt: 1,
  };
  const hourly: HourlyPoint[] = [
    { at: 1, temp, iconCode: '01d', description: 'clear sky' },
  ];
  return { current, hourly };
}

describe('compareStore', () => {
  it('loads A and B independently into valid ready states', async () => {
    const store = createCompareStore({
      fetchBundle: async ({ lat }) =>
        lat === london.lat ? bundle(london, 18) : bundle(paris, 24),
      toErrorMessage: () => 'Could not load weather.',
    });

    await Promise.all([
      store.getState().loadSlot('a', london),
      store.getState().loadSlot('b', paris),
    ]);

    const state = store.getState();
    assert.equal(state.a.status, 'ready');
    assert.equal(state.b.status, 'ready');
    if (state.a.status === 'ready' && state.b.status === 'ready') {
      assert.equal(state.a.current.temp, 18);
      assert.equal(state.b.current.temp, 24);
    }
  });

  it('aborts a stale request when the same slot changes', async () => {
    const signals: AbortSignal[] = [];
    const store = createCompareStore({
      fetchBundle: ({ lat, signal }) =>
        new Promise((resolve, reject) => {
          if (signal) {
            signals.push(signal);
            signal.addEventListener('abort', () => reject(new Error('aborted')));
          }
          setTimeout(
            () =>
              resolve(
                lat === london.lat
                  ? bundle(london, 18)
                  : bundle(paris, 24),
              ),
            lat === london.lat ? 20 : 1,
          );
        }),
      toErrorMessage: () => 'Could not load weather.',
    });

    const stale = store.getState().loadSlot('a', london);
    const latest = store.getState().loadSlot('a', paris);
    await Promise.all([stale, latest]);

    assert.equal(signals[0]?.aborted, true);
    const slot = store.getState().a;
    assert.equal(slot.status, 'ready');
    if (slot.status === 'ready') {
      assert.equal(slot.location.id, 'paris');
    }
  });

  it('aborts only loading slots on dispose and avoids stuck loading', async () => {
    let signal: AbortSignal | undefined;
    const store = createCompareStore({
      fetchBundle: ({ signal: requestSignal }) =>
        new Promise((_resolve, reject) => {
          signal = requestSignal;
          requestSignal?.addEventListener('abort', () =>
            reject(new Error('aborted')),
          );
        }),
      toErrorMessage: () => 'Could not load weather.',
    });

    const request = store.getState().loadSlot('a', london);
    assert.equal(store.getState().a.status, 'loading');

    store.getState().dispose();
    await request;

    assert.equal(signal?.aborted, true);
    assert.equal(store.getState().a.status, 'idle');
  });

  it('normalizes network failures and allows retry', async () => {
    let attempts = 0;
    const store = createCompareStore({
      fetchBundle: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new NetworkError();
        }
        return bundle(london, 18);
      },
      toErrorMessage: (error) =>
        error instanceof NetworkError
          ? 'No network connection.'
          : 'Could not load weather.',
    });

    await store.getState().loadSlot('a', london);
    assert.equal(store.getState().a.status, 'error');

    await store.getState().retrySlot('a');
    assert.equal(store.getState().a.status, 'ready');
  });
});
