import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { isCanceledError } from '@/core/http/errors';
import { getLastKnownPosition } from '@/features/location';
import {
  reverseGeocode,
  usePlaceSearch,
  useWeatherStore,
  type WeatherLocation,
} from '@/features/weather';

import { FALLBACK_PIN, type MapPin } from './camera';
import { toUserMapMessage } from './errorMessage';

export type MapBanner =
  | { kind: 'hidden' }
  | { kind: 'info'; message: string }
  | { kind: 'error'; message: string };

function pinFromLocation(location: WeatherLocation): MapPin {
  return {
    lat: location.lat,
    lon: location.lon,
    title: location.name,
  };
}

export function useMapScreen() {
  const { selectedLocation, status, loadWeather, noteUserSelection, bootstrapFromDevice } =
    useWeatherStore(
      useShallow((s) => ({
        selectedLocation: s.selectedLocation,
        status: s.status,
        loadWeather: s.loadWeather,
        noteUserSelection: s.noteUserSelection,
        bootstrapFromDevice: s.bootstrapFromDevice,
      })),
    );

  const [pin, setPin] = useState<MapPin>(() =>
    selectedLocation ? pinFromLocation(selectedLocation) : FALLBACK_PIN,
  );
  const [banner, setBanner] = useState<MapBanner>({ kind: 'hidden' });

  const placeSearch = usePlaceSearch({
    debounceMs: 400,
    mapError: (error) => toUserMapMessage(error, 'search'),
  });

  const reverseAbortRef = useRef<AbortController | null>(null);
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const requestGenRef = useRef(0);

  function beginRequest() {
    requestGenRef.current += 1;
    return requestGenRef.current;
  }

  useFocusEffect(
    useCallback(() => {
      const location = useWeatherStore.getState().selectedLocation;
      if (location) {
        setPin(pinFromLocation(location));
      }
    }, []),
  );

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
      requestGenRef.current += 1;
      reverseAbortRef.current?.abort();
    };
  }, []);

  const applyWeatherStatus = useCallback((generation: number) => {
    if (generation !== requestGenRef.current) {
      return;
    }
    const weather = useWeatherStore.getState();
    if (weather.status === 'error') {
      setBanner({
        kind: 'error',
        message: weather.errorMessage ?? 'Could not load weather. Try again.',
      });
      return;
    }
    if (weather.status === 'empty') {
      setBanner({
        kind: 'error',
        message: weather.emptyMessage ?? 'Could not read your current position.',
      });
      return;
    }
    setBanner({ kind: 'hidden' });
  }, []);

  const loadPinWeather = useCallback(
    async (lat: number, lon: number, name: string | undefined, generation: number) => {
      setBanner({ kind: 'info', message: 'Loading weather…' });
      await loadWeather({ lat, lon, name, force: true });
      applyWeatherStatus(generation);
    },
    [applyWeatherStatus, loadWeather],
  );

  const onPickPlace = useCallback(
    async (lat: number, lon: number) => {
      reverseAbortRef.current?.abort();
      const gen = beginRequest();
      const controller = new AbortController();
      reverseAbortRef.current = controller;

      noteUserSelection();
      setPin({ lat, lon, title: 'Selected place' });
      setBanner({ kind: 'info', message: 'Loading weather…' });

      let name: string | undefined;
      try {
        const place = await reverseGeocode(lat, lon, { signal: controller.signal });
        if (gen !== requestGenRef.current || controller.signal.aborted) {
          return;
        }
        if (place) {
          name = place.name;
          setPin({ lat, lon, title: place.name });
        }
      } catch (error) {
        if (isCanceledError(error) || controller.signal.aborted) {
          if (gen === requestGenRef.current) {
            setBanner({ kind: 'hidden' });
          }
          return;
        }
      }

      if (gen !== requestGenRef.current || controller.signal.aborted) {
        return;
      }

      await loadPinWeather(lat, lon, name, gen);
    },
    [loadPinWeather, noteUserSelection],
  );

  const retryPinWeather = useCallback(() => {
    const current = pinRef.current;
    const gen = beginRequest();
    void loadPinWeather(current.lat, current.lon, current.title, gen);
  }, [loadPinWeather]);

  const goToMyLocation = useCallback(async () => {
    reverseAbortRef.current?.abort();
    const gen = beginRequest();
    setBanner({ kind: 'info', message: 'Finding your location…' });
    await bootstrapFromDevice({ force: true });
    if (gen !== requestGenRef.current) {
      return;
    }
    const weather = useWeatherStore.getState();
    if (weather.selectedLocation) {
      setPin(pinFromLocation(weather.selectedLocation));
    }
    applyWeatherStatus(gen);
  }, [applyWeatherStatus, bootstrapFromDevice]);

  const selectPlace = useCallback(
    (place: WeatherLocation) => {
      Keyboard.dismiss();
      reverseAbortRef.current?.abort();
      const gen = beginRequest();
      placeSearch.clear();
      setPin(pinFromLocation(place));
      void loadPinWeather(place.lat, place.lon, place.name, gen);
    },
    [loadPinWeather, placeSearch.clear],
  );

  return {
    pin,
    banner,
    selectedLocation,
    weatherStatus: status,
    query: placeSearch.query,
    setQuery: placeSearch.setQuery,
    results: placeSearch.results,
    searchStatus: placeSearch.status,
    searchError: placeSearch.errorMessage,
    onPickPlace,
    retryPinWeather,
    goToMyLocation,
    selectPlace,
    clearSearch: placeSearch.clear,
  };
}
