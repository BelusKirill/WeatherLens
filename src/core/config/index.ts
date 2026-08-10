import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const openWeatherApiKey =
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ??
  (extra.openWeatherApiKey as string | undefined) ??
  '';

export const config = {
  openWeatherApiKey,
  openWeatherBaseUrl: 'https://api.openweathermap.org',
};

export function isApiKeyConfigured(): boolean {
  return Boolean(config.openWeatherApiKey);
}
