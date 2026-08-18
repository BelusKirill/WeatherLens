import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { isCanceledError } from '@/core/http/errors';
import { getLastKnownPosition } from '@/features/location';
import {
  reverseGeocode,
  searchPlaces,
  useWeatherStore,
  type WeatherLocation,
} from '@/features/weather';

import { FALLBACK_PIN, isSameMapPoint, type MapPin } from './camera';
import { toUserMapMessage } from './errorMessage';

const SEARCH_DEBOUNCE_MS = 400;
const SEARCH_MIN_LENGTH = 2;

export type MapBanner =
  | { kind: 'hidden' }
  | { kind: 'info'; message: string }
  | { kind: 'error'; message: string };

export type PlaceSearchStatus = 'idle' | 'loading' | 'empty' | 'error';

function pinFromLocation(location: WeatherLocation): MapPin {
  return {
    lat: location.lat,
    lon: location.lon,
    title: location.name,
  };
}

export function useMapScreen() {
  const { selectedLocation, status, loadWeather } = useWeatherStore(
    useShallow((s) => ({
      selectedLocation: s.selectedLocation,
      status: s.status,
      loadWeather: s.loadWeather,
    })),
  );

  const [pin, setPin] = useState<MapPin>(() =>
    selectedLocation ? pinFromLocation(selectedLocation) : FALLBACK_PIN,
  );
  const [banner, setBanner] = useState<MapBanner>({ kind: 'hidden' });

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WeatherLocation[]>([]);
  const [searchStatus, setSearchStatus] = useState<PlaceSearchStatus>('idle');
  const [searchError, setSearchError] = useState<string | null>(null);

  const reverseAbortRef = useRef<AbortController | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const pinRef = useRef(pin);
  pinRef.current = pin;

  useEffect(() => {
    if (!selectedLocation) {
      return;
    }
    setPin((current) => {
      if (isSameMapPoint(current, selectedLocation)) {
        return { ...current, title: selectedLocation.name };
      }
      return pinFromLocation(selectedLocation);
    });
  }, [selectedLocation]);

  useEffect(() => {
    if (useWeatherStore.getState().selectedLocation) {
      return;
    }

    let cancelled = false;
    void (async () => {
      const last = await getLastKnownPosition();
      if (cancelled || useWeatherStore.getState().selectedLocation) {
        return;
      }
      if (last) {
        setPin({
          lat: last.lat,
          lon: last.lon,
          title: 'Your area',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      reverseAbortRef.current?.abort();
      searchAbortRef.current?.abort();
    };
  }, []);

  const applyWeatherStatus = useCallback(() => {
    const weather = useWeatherStore.getState();
    if (weather.status === 'error') {
      setBanner({
        kind: 'error',
        message: weather.errorMessage ?? 'Could not load weather. Try again.',
      });
      return;
    }
    setBanner({ kind: 'hidden' });
  }, []);

  const loadPinWeather = useCallback(
    async (lat: number, lon: number, name?: string) => {
      setBanner({ kind: 'info', message: 'Loading weather…' });
      await loadWeather({ lat, lon, name, force: true });
      applyWeatherStatus();
    },
    [applyWeatherStatus, loadWeather],
  );

  const onPickPlace = useCallback(
    async (lat: number, lon: number) => {
      reverseAbortRef.current?.abort();
      const controller = new AbortController();
      reverseAbortRef.current = controller;

      setPin({ lat, lon, title: 'Selected place' });
      setBanner({ kind: 'info', message: 'Loading weather…' });

      let name: string | undefined;
      try {
        const place = await reverseGeocode(lat, lon, { signal: controller.signal });
        if (controller.signal.aborted) {
          return;
        }
        if (place) {
          name = place.name;
          setPin({ lat, lon, title: place.name });
        }
      } catch (error) {
        if (isCanceledError(error) || controller.signal.aborted) {
          return;
        }
      }

      if (controller.signal.aborted) {
        return;
      }

      await loadPinWeather(lat, lon, name);
    },
    [loadPinWeather],
  );

  const retryPinWeather = useCallback(() => {
    const current = pinRef.current;
    void loadPinWeather(current.lat, current.lon, current.title);
  }, [loadPinWeather]);

  const selectPlace = useCallback(
    (place: WeatherLocation) => {
      Keyboard.dismiss();
      reverseAbortRef.current?.abort();
      setQuery('');
      setResults([]);
      setSearchStatus('idle');
      setSearchError(null);
      setPin(pinFromLocation(place));
      void loadPinWeather(place.lat, place.lon, place.name);
    },
    [loadPinWeather],
  );

  const clearSearch = useCallback(() => {
    searchAbortRef.current?.abort();
    setQuery('');
    setResults([]);
    setSearchStatus('idle');
    setSearchError(null);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < SEARCH_MIN_LENGTH) {
      searchAbortRef.current?.abort();
      setResults([]);
      setSearchStatus('idle');
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    searchAbortRef.current?.abort();
    searchAbortRef.current = controller;

    const timer = setTimeout(() => {
      setSearchStatus('loading');
      setSearchError(null);
      setResults([]);
      void (async () => {
        try {
          const places = await searchPlaces(trimmed, {
            limit: 5,
            signal: controller.signal,
          });
          if (controller.signal.aborted) {
            return;
          }
          setResults(places);
          setSearchStatus(places.length === 0 ? 'empty' : 'idle');
        } catch (error) {
          if (isCanceledError(error) || controller.signal.aborted) {
            return;
          }
          setResults([]);
          setSearchStatus('error');
          setSearchError(toUserMapMessage(error, 'search'));
        }
      })();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return {
    pin,
    banner,
    selectedLocation,
    weatherStatus: status,
    query,
    setQuery,
    results,
    searchStatus,
    searchError,
    onPickPlace,
    retryPinWeather,
    selectPlace,
    clearSearch,
  };
}
