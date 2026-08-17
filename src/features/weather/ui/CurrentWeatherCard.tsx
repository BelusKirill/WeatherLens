import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/core/theme';

import type { CurrentWeather, TemperatureUnit } from '../model/types';
import {
  convertWindMs,
  formatTempC,
  windSpeedLabel,
} from '../model/units';
import { WeatherIcon } from './WeatherIcon';

type CurrentWeatherCardProps = {
  /** Metric payload from the store. */
  weather: CurrentWeather;
  unit: TemperatureUnit;
};

export function CurrentWeatherCard({ weather, unit }: CurrentWeatherCardProps) {
  const theme = useAppTheme();
  const wind = convertWindMs(weather.windSpeed, unit);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text style={[styles.place, { color: theme.colors.text }]}>
            {weather.location.name}
          </Text>
          {weather.location.country ? (
            <Text style={{ color: theme.colors.textMuted }}>
              {weather.location.country}
            </Text>
          ) : null}
        </View>
        <WeatherIcon iconCode={weather.iconCode} size={88} />
      </View>

      <Text style={[styles.temp, { color: theme.colors.text }]}>
        {formatTempC(weather.temp, unit)}
      </Text>
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
        {capitalize(weather.description)}
      </Text>
      <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>
        Feels like {formatTempC(weather.feelsLike, unit)}
      </Text>

      <View style={styles.metaRow}>
        <Meta label="Humidity" value={`${weather.humidity}%`} />
        <Meta
          label="Wind"
          value={`${wind.toFixed(1)} ${windSpeedLabel(unit)}`}
        />
      </View>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  return (
    <View style={styles.meta}>
      <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: '600', marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titles: { flex: 1, paddingRight: 12, gap: 4 },
  place: { fontSize: 22, fontWeight: '700' },
  temp: { fontSize: 56, fontWeight: '300', marginTop: 4 },
  description: { fontSize: 17, textTransform: 'none' },
  metaRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  meta: { minWidth: 88 },
});
