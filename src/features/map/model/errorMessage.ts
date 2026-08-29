import { ApiError, NetworkError } from '@/core/http/errors';

export function toUserMapMessage(
  error: unknown,
  kind: 'search' | 'geocode',
): string {
  if (error instanceof NetworkError) {
    return 'No network connection. Check your connection and try again.';
  }

  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return 'Weather API key is invalid or blocked. Check your .env key.';
    }
    if (error.status === 429) {
      return 'Too many requests. Try again in a moment.';
    }
  }

  return kind === 'search'
    ? 'Could not search places. Try again.'
    : 'Could not identify this place.';
}
