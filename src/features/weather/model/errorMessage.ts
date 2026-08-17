import { ApiError, NetworkError } from '@/core/http/errors';

/** Short user-facing copy — never dump raw provider payloads into the UI. */
export function toUserWeatherMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return 'No network connection. Check your connection and try again.';
  }

  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return 'Weather API key is invalid or blocked. Check your .env key.';
    }
    if (error.status === 429) {
      return 'Too many weather requests. Try again in a moment.';
    }
    if (error.status === 404) {
      return 'No weather data for this location.';
    }
    return 'Could not load weather. Try again.';
  }

  return 'Could not load weather. Try again.';
}
