/**
 * Coordinates in-flight weather HTTP so remounts / Strict Mode do not spam the API.
 * Module state is resettable for tests and Fast Refresh dispose.
 */
export const DEDUPE_MS = 15_000;

export function weatherRequestKey(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

export type WeatherRequestGate = {
  tryJoin: (key: string) => Promise<void> | null;
  shouldSkipAsFresh: (args: {
    key: string;
    force: boolean;
    hasCurrent: boolean;
    now?: number;
  }) => boolean;
  begin: (key: string, run: (signal: AbortSignal) => Promise<void>) => Promise<void>;
  markSuccess: (key: string, now?: number) => void;
  getBootstrap: () => Promise<void> | null;
  setBootstrap: (promise: Promise<void> | null) => void;
  reset: () => void;
};

export function createWeatherRequestGate(): WeatherRequestGate {
  let activeController: AbortController | null = null;
  let inFlightKey: string | null = null;
  let inFlightPromise: Promise<void> | null = null;
  let lastSuccessKey: string | null = null;
  let lastSuccessAt = 0;
  let bootstrapPromise: Promise<void> | null = null;

  return {
    tryJoin(key) {
      if (inFlightKey === key && inFlightPromise) {
        return inFlightPromise;
      }
      return null;
    },

    shouldSkipAsFresh({ key, force, hasCurrent, now = Date.now() }) {
      if (force || !hasCurrent) {
        return false;
      }
      return (
        lastSuccessKey === key && now - lastSuccessAt < DEDUPE_MS
      );
    },

    begin(key, run) {
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;

      const promise = (async () => {
        try {
          await run(controller.signal);
        } finally {
          if (activeController === controller) {
            activeController = null;
          }
          if (inFlightKey === key) {
            inFlightKey = null;
            inFlightPromise = null;
          }
        }
      })();

      inFlightKey = key;
      inFlightPromise = promise;
      return promise;
    },

    markSuccess(key, now = Date.now()) {
      lastSuccessKey = key;
      lastSuccessAt = now;
    },

    getBootstrap() {
      return bootstrapPromise;
    },

    setBootstrap(promise) {
      bootstrapPromise = promise;
    },

    reset() {
      activeController?.abort();
      activeController = null;
      inFlightKey = null;
      inFlightPromise = null;
      lastSuccessKey = null;
      lastSuccessAt = 0;
      bootstrapPromise = null;
    },
  };
}

export const weatherRequestGate = createWeatherRequestGate();

// Fast Refresh: drop in-flight handles so a remount does not join a dead promise.
const hotModule =
  typeof module !== 'undefined'
    ? (module as { hot?: { dispose: (cb: () => void) => void } })
    : undefined;
hotModule?.hot?.dispose(() => {
  weatherRequestGate.reset();
});
