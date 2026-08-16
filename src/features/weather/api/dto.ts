/** OpenWeather Current Weather API response (subset). */
export type CurrentWeatherDto = {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: { speed: number };
  sys?: { country?: string };
  dt: number;
};

/** OpenWeather 5-day / 3-hour forecast response (subset). */
export type ForecastDto = {
  city: {
    id: number;
    name: string;
    country: string;
    coord: { lat: number; lon: number };
  };
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
};

/** OpenWeather Geocoding API — direct / reverse item. */
export type GeoPlaceDto = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};
