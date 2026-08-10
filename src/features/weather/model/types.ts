export type TemperatureUnit = 'metric' | 'imperial';

export type WeatherLocation = {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
};

export type CurrentWeather = {
  location: WeatherLocation;
  temp: number;
  feelsLike: number;
  description: string;
  iconCode: string;
  humidity: number;
  windSpeed: number;
  observedAt: number;
};

export type HourlyPoint = {
  at: number;
  temp: number;
  iconCode: string;
  description: string;
};
