import { Text } from 'react-native';

import { isApiKeyConfigured } from '@/core/config';
import { useAppTheme } from '@/core/theme';
import { EmptyState, Screen } from '@/shared/ui';

import { useWeatherStore } from '../model/weatherStore';

export function TodayScreen() {
  const theme = useAppTheme();
  const { current, status } = useWeatherStore();

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

  if (status === 'idle' && !current) {
    return (
      <Screen>
        <EmptyState
          title="Today"
          subtitle="Pick a place on the Map tab or allow location access to load weather."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '600' }}>
        {current?.location.name ?? 'Today'}
      </Text>
      <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>
        Hourly forecast and animated icons land in Phase 1.
      </Text>
    </Screen>
  );
}
