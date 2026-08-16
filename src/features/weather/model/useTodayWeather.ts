import { useCallback, useEffect } from 'react';

import { useWeatherStore } from './weatherStore';

export function useTodayWeather() {
  const status = useWeatherStore((s) => s.status);
  const current = useWeatherStore((s) => s.current);
  const hourly = useWeatherStore((s) => s.hourly);
  const unit = useWeatherStore((s) => s.unit);
  const errorMessage = useWeatherStore((s) => s.errorMessage);
  const emptyMessage = useWeatherStore((s) => s.emptyMessage);
  const emptyReason = useWeatherStore((s) => s.emptyReason);
  const toggleUnit = useWeatherStore((s) => s.toggleUnit);
  const bootstrapFromDevice = useWeatherStore((s) => s.bootstrapFromDevice);
  const loadDemoLondon = useWeatherStore((s) => s.loadDemoLondon);
  const loadWeather = useWeatherStore((s) => s.loadWeather);

  const loadFromDevice = useCallback(() => {
    return bootstrapFromDevice();
  }, [bootstrapFromDevice]);

  const loadDemo = useCallback(() => {
    return loadDemoLondon();
  }, [loadDemoLondon]);

  const retry = useCallback(async () => {
    const loc = useWeatherStore.getState().selectedLocation;
    if (loc) {
      await loadWeather({ lat: loc.lat, lon: loc.lon, name: loc.name });
      return;
    }
    await bootstrapFromDevice();
  }, [bootstrapFromDevice, loadWeather]);

  useEffect(() => {
    // No abort-on-unmount: Strict Mode was canceling the first request, leaving
    // status=idle and a forever spinner, then firing a second burst of API calls.
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
    loadFromDevice,
    loadDemo,
  };
}
