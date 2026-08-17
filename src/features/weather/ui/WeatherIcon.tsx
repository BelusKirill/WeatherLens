import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { resolveWeatherLottie } from './lottieMap';

type WeatherIconProps = {
  iconCode: string;
  size?: number;
  /** Hourly strip should stay static to avoid N looping animations. */
  animated?: boolean;
};

export function WeatherIcon({
  iconCode,
  size = 72,
  animated = true,
}: WeatherIconProps) {
  const source = resolveWeatherLottie(iconCode);

  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        source={source}
        autoPlay={animated}
        loop={animated}
        progress={animated ? undefined : 0}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: { width: '100%', height: '100%' },
});
