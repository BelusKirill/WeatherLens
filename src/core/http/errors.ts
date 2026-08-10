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
  if (axiosIsNetwork(error)) {
    return new NetworkError();
  }

  if (axiosIsHttp(error)) {
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

function axiosIsNetwork(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as { code?: string }).code === 'ERR_NETWORK'
  );
}

function axiosIsHttp(
  error: unknown,
): error is { response?: { status?: number; data?: unknown } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    'response' in error
  );
}
