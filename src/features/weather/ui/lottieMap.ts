import type { AnimationObject } from 'lottie-react-native';

import clear from '../../../../assets/lottie/clear.json';
import clouds from '../../../../assets/lottie/clouds.json';
import rain from '../../../../assets/lottie/rain.json';

/**
 * Map OpenWeather icon codes (e.g. 01d, 10n) → Lottie group.
 * Phase 1 ships clear / clouds / rain; other codes fall back to the closest group.
 */
export function resolveWeatherLottie(iconCode: string): AnimationObject {
  const code = iconCode.slice(0, 2);

  switch (code) {
    case '01':
      return clear as AnimationObject;
    case '02':
    case '03':
    case '04':
    case '50': // mist → soft cloud stand-in
      return clouds as AnimationObject;
    case '09':
    case '10':
    case '11': // thunder → rain stand-in
    case '13': // snow → rain stand-in until dedicated asset
      return rain as AnimationObject;
    default:
      return clouds as AnimationObject;
  }
}
