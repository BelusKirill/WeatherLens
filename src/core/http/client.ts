import axios from 'axios';

import { config } from '@/core/config';

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
