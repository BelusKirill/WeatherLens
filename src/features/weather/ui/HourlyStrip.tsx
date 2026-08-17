import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/core/theme';

import type { HourlyPoint, TemperatureUnit } from '../model/types';
import { formatTempC } from '../model/units';
import { WeatherIcon } from './WeatherIcon';

type HourlyStripProps = {
  points: HourlyPoint[];
  unit: TemperatureUnit;
};

/** OpenWeather 5-day endpoint returns 3-hour steps — label honestly. */
export function HourlyStrip({ points, unit }: HourlyStripProps) {
  const theme = useAppTheme();

  if (points.length === 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Next 24 hours
      </Text>
      <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
        Every 3 hours
      </Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {points.map((item) => (
          <View
            key={String(item.at)}
            style={[
              styles.item,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
              {formatHour(item.at)}
            </Text>
            <WeatherIcon iconCode={item.iconCode} size={40} animated={false} />
            <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
              {formatTempC(item.temp, unit)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function formatHour(at: number): string {
  const date = new Date(at);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    hour12: true,
  });
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  title: { fontSize: 17, fontWeight: '600' },
  list: { gap: 10, paddingRight: 8, paddingTop: 4 },
  item: {
    width: 76,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
});
