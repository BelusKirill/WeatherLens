import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { isApiKeyConfigured } from '@/core/config';
import { useAppTheme } from '@/core/theme';
import { openAppSettings } from '@/features/location';
import { EmptyState, Screen } from '@/shared/ui';

import { useTodayWeather } from '../model/useTodayWeather';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyStrip } from './HourlyStrip';
import { UnitToggle } from './UnitToggle';

export function TodayScreen() {
  const theme = useAppTheme();
  const {
    status,
    current,
    hourly,
    unit,
    errorMessage,
    emptyMessage,
    emptyReason,
    toggleUnit,
    retry,
    loadFromDevice,
    loadDemo,
  } = useTodayWeather();

  if (!isApiKeyConfigured()) {
    return (
      <Screen>
        <EmptyState
          title="Configure API key"
          subtitle="Copy .env.example to .env and set EXPO_PUBLIC_OPENWEATHER_API_KEY."
        />
      </Screen>
    );
  }

  // Only a real in-flight load shows the full-screen spinner.
  // Never treat idle as loading — that caused an infinite spinner after aborted boots.
  const bootstrapping = status === 'loading' && !current;

  if (bootstrapping) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={{ color: theme.colors.textMuted, marginTop: 12 }}>
            Loading weather…
          </Text>
        </View>
      </Screen>
    );
  }

  if (status === 'empty') {
    const needsSettings =
      emptyReason === 'denied' || emptyReason === 'services_off';

    return (
      <Screen>
        <View style={styles.centered}>
          <EmptyState
            title="Location needed"
            subtitle={
              emptyMessage ??
              'Allow location access to show weather for your area.'
            }
          />
          <View style={styles.actions}>
            {needsSettings ? (
              <ActionButton
                label="Open settings"
                onPress={() => {
                  void openAppSettings();
                }}
              />
            ) : (
              <ActionButton
                label="Allow location"
                onPress={() => {
                  void loadFromDevice();
                }}
              />
            )}
            <ActionButton
              label="Try again"
              onPress={() => {
                void loadFromDevice();
              }}
              muted
            />
            <ActionButton
              label="Try demo (London)"
              onPress={() => {
                void loadDemo();
              }}
              muted
            />
          </View>
        </View>
      </Screen>
    );
  }

  if (status === 'error' && !current) {
    return (
      <Screen>
        <View style={styles.centered}>
          <EmptyState
            title="Couldn’t load weather"
            subtitle={errorMessage ?? 'Something went wrong.'}
          />
          <View style={styles.actions}>
            <ActionButton
              label="Retry"
              onPress={() => {
                void retry();
              }}
            />
            <ActionButton
              label="Try demo (London)"
              onPress={() => {
                void loadDemo();
              }}
              muted
            />
          </View>
        </View>
      </Screen>
    );
  }

  if (!current) {
    return (
      <Screen>
        <View style={styles.centered}>
          <EmptyState
            title="Today"
            subtitle="No weather data yet. Allow location or try the demo city."
          />
          <View style={styles.actions}>
            <ActionButton
              label="Allow location"
              onPress={() => {
                void loadFromDevice();
              }}
            />
            <ActionButton
              label="Try demo (London)"
              onPress={() => {
                void loadDemo();
              }}
              muted
            />
          </View>
        </View>
      </Screen>
    );
  }

  const refreshing = status === 'loading';

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.md },
        ]}
      >
        <View style={styles.toolbar}>
          <Text style={[styles.heading, { color: theme.colors.text }]}>
            Today
          </Text>
          <View style={styles.toolbarRight}>
            {refreshing ? (
              <ActivityIndicator color={theme.colors.accent} />
            ) : null}
            <UnitToggle
              unit={unit}
              disabled={refreshing}
              onToggle={() => {
                void toggleUnit();
              }}
            />
          </View>
        </View>

        {status === 'error' && errorMessage ? (
          <Text style={{ color: theme.colors.danger }}>{errorMessage}</Text>
        ) : null}

        <CurrentWeatherCard weather={current} unit={unit} />
        <HourlyStrip points={hourly} />
      </ScrollView>
    </Screen>
  );
}

function ActionButton({
  label,
  onPress,
  muted,
}: {
  label: string;
  onPress: () => void;
  muted?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: muted ? theme.colors.surface : theme.colors.accent,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text
        style={{
          color: muted ? theme.colors.text : '#FFFFFF',
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  content: {
    gap: 20,
    paddingBottom: 32,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heading: { fontSize: 28, fontWeight: '700' },
  actions: { gap: 10 },
  button: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
