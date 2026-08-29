import { useCallback, useEffect, useRef, useState } from 'react';

import { isCanceledError } from '@/core/http';

import { searchPlaces } from '../api/geoApi';
import { toUserWeatherMessage } from './errorMessage';
import type { WeatherLocation } from './types';

export type PlaceSearchStatus = 'idle' | 'loading' | 'empty' | 'error';

type UsePlaceSearchOptions = {
  debounceMs?: number;
  minLength?: number;
  limit?: number;
  /** Override default weather-facing error copy (e.g. map-specific). */
  mapError?: (error: unknown) => string;
};

const DEFAULT_DEBOUNCE_MS = 350;
const DEFAULT_MIN_LENGTH = 2;
const DEFAULT_LIMIT = 5;

export function usePlaceSearch(options: UsePlaceSearchOptions = {}) {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    minLength = DEFAULT_MIN_LENGTH,
    limit = DEFAULT_LIMIT,
    mapError = toUserWeatherMessage,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherLocation[]>([]);
  const [status, setStatus] = useState<PlaceSearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mapErrorRef = useRef(mapError);
  mapErrorRef.current = mapError;

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setQuery('');
    setResults([]);
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minLength) {
      abortRef.current?.abort();
      setResults([]);
      setStatus('idle');
      setErrorMessage(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const timer = setTimeout(() => {
      setStatus('loading');
      setErrorMessage(null);
      setResults([]);
      void (async () => {
        try {
          const places = await searchPlaces(trimmed, {
            limit,
            signal: controller.signal,
          });
          if (controller.signal.aborted) {
            return;
          }
          setResults(places);
          setStatus(places.length === 0 ? 'empty' : 'idle');
        } catch (error) {
          if (isCanceledError(error) || controller.signal.aborted) {
            return;
          }
          setResults([]);
          setStatus('error');
          setErrorMessage(mapErrorRef.current(error));
        }
      })();
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs, minLength, limit]);

  return {
    query,
    setQuery,
    results,
    status,
    errorMessage,
    clear,
  };
}
