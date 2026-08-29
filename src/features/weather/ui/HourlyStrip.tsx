import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

import { useAppTheme } from '@/core/theme';

import type { HourlyPoint, TemperatureUnit } from '../model/types';
import { formatTempC } from '../model/units';
import { WeatherIcon } from './WeatherIcon';

type HourlyStripProps = {
  points: HourlyPoint[];
  unit: TemperatureUnit;
  /** Cap visible points (Compare uses a short strip). */
  limit?: number;
  /**
   * Compact fill layout: equal-width cells across the row (no side gaps).
   * Used by Compare; Today keeps the horizontal scroll strip.
   */
  compact?: boolean;
  title?: string;
  /** Pass `null` to hide the subtitle. */
  subtitle?: string | null;
};

/** OpenWeather 5-day endpoint returns 3-hour steps — label honestly. */
export function HourlyStrip({
  points,
  unit,
  limit,
  compact = false,
  title = 'Next 24 hours',
  subtitle = 'Every 3 hours',
}: HourlyStripProps) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const { fontScale } = useWindowDimensions();
  const visible = limit == null ? points : points.slice(0, limit);
  const compactFill = compact && fontScale <= 1.3;

  if (visible.length === 0) {
    return null;
  }

  const cells = visible.map((item, index) => (
    <Animated.View
      key={String(item.at)}
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(index * 45)
              .springify()
              .damping(18)
      }
      style={[
        compact
          ? [
              styles.itemCompact,
              !compactFill && styles.itemCompactScrollable,
            ]
          : styles.item,
        {
          backgroundColor: compact
            ? theme.colors.background
            : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={{
          color: theme.colors.textMuted,
          fontSize: compact ? 11 : 13,
        }}
      >
        {formatHour(item.at)}
      </Text>
      <WeatherIcon
        iconCode={item.iconCode}
        size={compact ? 26 : 40}
        animated={false}
      />
      <Text
        style={{
          color: theme.colors.text,
          fontWeight: '600',
          fontSize: compact ? 12 : 14,
        }}
      >
        {formatTempC(item.temp, unit)}
      </Text>
    </Animated.View>
  ));

  return (
    <View style={styles.root}>
      {title ? (
        <Text
          style={[
            compact ? styles.titleCompact : styles.title,
            { color: theme.colors.text },
          ]}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: compact ? 12 : 13,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      {compactFill ? (
        <View style={styles.fillRow}>{cells}</View>
      ) : (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={compact ? styles.compactList : styles.list}
        >
          {cells}
        </ScrollView>
      )}
    </View>
  );
}

function formatHour(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, {
    hour: 'numeric',
    hour12: true,
  });
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  title: { fontSize: 17, fontWeight: '600' },
  titleCompact: { fontSize: 12, fontWeight: '600' },
  list: { gap: 10, paddingRight: 8, paddingTop: 4 },
  compactList: { gap: 6, paddingRight: 4, paddingTop: 4 },
  fillRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
    paddingTop: 4,
  },
  item: {
    width: 76,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  itemCompact: {
    flex: 1,
    minWidth: 0,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    gap: 4,
  },
  itemCompactScrollable: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 72,
  },
});
