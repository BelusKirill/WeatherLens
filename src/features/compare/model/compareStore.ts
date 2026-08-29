import {
  fetchWeatherBundle,
  toUserWeatherMessage,
} from '@/features/weather';

import { createCompareStore } from './compareStoreCore';

export type {
  CompareSlot,
  CompareSlotId,
} from './compareStoreCore';

export const useCompareStore = createCompareStore({
  fetchBundle: fetchWeatherBundle,
  toErrorMessage: toUserWeatherMessage,
});
