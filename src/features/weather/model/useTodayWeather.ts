import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useWeatherStore } from './weatherStore';

export function useTodayWeather() {
  const {
    status,
    current,
    hourly,
    unit,
    errorMessage,
    emptyMessage,
    emptyReason,
    toggleUnit,
    bootstrapFromDevice,
    loadDemoLondon,
    loadWeather,
    hasHydratedUnit,
  } = useWeatherStore(
    useShallow((s) => ({
      status: s.status,
      current: s.current,
      hourly: s.hourly,
      unit: s.unit,
      errorMessage: s.errorMessage,
      emptyMessage: s.emptyMessage,
      emptyReason: s.emptyReason,
      toggleUnit: s.toggleUnit,
      bootstrapFromDevice: s.bootstrapFromDevice,
      loadDemoLondon: s.loadDemoLondon,
      loadWeather: s.loadWeather,
      hasHydratedUnit: s.hasHydratedUnit,
    })),
  );

  const retry = useCallback(async () => {
    const loc = useWeatherStore.getState().selectedLocation;
    if (loc) {
      await loadWeather({
        lat: loc.lat,
        lon: loc.lon,
        name: loc.name,
        force: true,
      });
      return;
    }
    await bootstrapFromDevice({ force: true });
  }, [bootstrapFromDevice, loadWeather]);

  useEffect(() => {
    void bootstrapFromDevice();
  }, [bootstrapFromDevice]);

  return {
    status,
    current,
    hourly,
    unit,
    errorMessage,
    emptyMessage,
    emptyReason,
    toggleUnit,
    retry,
    bootstrapFromDevice,
    loadDemoLondon,
    hasHydratedUnit,
  };
}
