import axios from 'axios';

import { config } from '@/core/config';

import { toAppError } from './errors';

export const http = axios.create({
  baseURL: config.openWeatherBaseUrl,
  timeout: 15_000,
});

http.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    appid: config.openWeatherApiKey,
  };
  return request;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    return Promise.reject(toAppError(error));
  },
);
