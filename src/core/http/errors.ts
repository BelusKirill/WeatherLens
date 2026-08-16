import axios from 'axios';

export class NetworkError extends Error {
  constructor(message = 'Network unavailable') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function toAppError(error: unknown): Error {
  if (axios.isCancel(error)) {
    return error instanceof Error ? error : new Error('Request canceled');
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return new NetworkError();
    }

    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      'Request failed';
    return new ApiError(message, status);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unknown error');
}

export function isCanceledError(error: unknown): boolean {
  return axios.isCancel(error);
}
