import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/core/theme';
import {
  convertWindMs,
  formatTempC,
  HourlyStrip,
  type TemperatureUnit,
  type WeatherLocation,
  WeatherIcon,
  windSpeedLabel,
} from '@/features/weather';

import type { CompareSlot, CompareSlotId } from '../model/compareStore';
import { SlotPicker } from './SlotPicker';

type CompareSlotCardProps = {
  slotId: CompareSlotId;
  slot: CompareSlot;
  unit: TemperatureUnit;
  onPick: (location: WeatherLocation) => void;
  onClear: () => void;
  onRetry: () => void;
};

export function CompareSlotCard({
  slotId,
  slot,
  unit,
  onPick,
  onClear,
  onRetry,
}: CompareSlotCardProps) {
  const theme = useAppTheme();
  const label = slotId === 'a' ? 'A' : 'B';

  if (slot.status === 'idle') {
    return (
      <View style={styles.root}>
        <Text style={[styles.badge, { color: theme.colors.textMuted }]}>
          Slot {label}
        </Text>
        <SlotPicker slotId={slotId} onPick={onPick} />
      </View>
    );
  }

  if (slot.status === 'loading') {
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
        <SlotHeader
          label={label}
          title={slot.location.name}
          onClear={onClear}
        />
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accent} />
          <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>
            Loading weather…
          </Text>
        </View>
      </View>
    );
  }

  if (slot.status === 'error') {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.danger,
          },
        ]}
      >
        <SlotHeader
          label={label}
          title={slot.location.name}
          onClear={onClear}
        />
        <Text style={{ color: theme.colors.danger, lineHeight: 20 }}>
          {slot.errorMessage}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={[
            styles.retry,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  // Status is now narrowed to ready, so current/location are guaranteed.
  const weather = slot.current;
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
      <SlotHeader
        label={label}
        title={weather.location.name}
        subtitle={weather.location.country}
        onClear={onClear}
        trailing={<WeatherIcon iconCode={weather.iconCode} size={56} />}
      />

      <Text style={[styles.temp, { color: theme.colors.text }]}>
        {formatTempC(weather.temp, unit)}
      </Text>
      <Text style={{ color: theme.colors.textMuted }}>
        {capitalize(weather.description)}
      </Text>
      <Text style={{ color: theme.colors.textMuted, marginTop: 2 }}>
        Feels {formatTempC(weather.feelsLike, unit)}
      </Text>

      <View style={styles.metaRow}>
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
          Humidity {weather.humidity}%
        </Text>
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
          Wind {wind.toFixed(1)} {windSpeedLabel(unit)}
        </Text>
      </View>

      <HourlyStrip
        points={slot.hourly}
        unit={unit}
        limit={5}
        compact
        title="Next hours"
        subtitle={null}
      />
    </View>
  );
}

function SlotHeader({
  label,
  title,
  subtitle,
  onClear,
  trailing,
}: {
  label: string;
  title: string;
  subtitle?: string;
  onClear: () => void;
  trailing?: ReactNode;
}) {
  const theme = useAppTheme();

  return (
    <View style={styles.header}>
      <View style={styles.titles}>
        <Text style={[styles.badge, { color: theme.colors.textMuted }]}>
          Slot {label}
        </Text>
        <Text
          style={[styles.place, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: theme.colors.textMuted }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Clear slot ${label}`}
        hitSlop={8}
        onPress={onClear}
        style={[styles.clear, { borderColor: theme.colors.border }]}
      >
        <Text style={{ color: theme.colors.textMuted, fontWeight: '600' }}>
          ×
        </Text>
      </Pressable>
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
  root: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  card: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titles: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  place: {
    fontSize: 18,
    fontWeight: '700',
  },
  clear: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 40,
    fontWeight: '300',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
});
