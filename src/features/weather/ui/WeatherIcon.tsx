import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { resolveWeatherLottie } from './lottieMap';

type WeatherIconProps = {
  iconCode: string;
  size?: number;
};

export function WeatherIcon({ iconCode, size = 72 }: WeatherIconProps) {
  const source = resolveWeatherLottie(iconCode);

  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        source={source}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: { width: '100%', height: '100%' },
});
