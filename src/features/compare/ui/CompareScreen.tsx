import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { isApiKeyConfigured } from '@/core/config';
import { useAppTheme } from '@/core/theme';
import type { WeatherLocation } from '@/features/weather';
import { useWeatherStore } from '@/features/weather';
import { EmptyState, Screen } from '@/shared/ui';

import {
  type CompareSlotId,
  useCompareStore,
} from '../model/compareStore';
import { CompareSlotCard } from './CompareSlotCard';

const SLOT_IDS: CompareSlotId[] = ['a', 'b'];

export function CompareScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const sideBySide = width >= 700;

  const unit = useWeatherStore((state) => state.unit);
  const slotA = useCompareStore((state) => state.a);
  const slotB = useCompareStore((state) => state.b);
  const loadSlot = useCompareStore((state) => state.loadSlot);
  const clearSlot = useCompareStore((state) => state.clearSlot);
  const retrySlot = useCompareStore((state) => state.retrySlot);
  const dispose = useCompareStore((state) => state.dispose);

  useEffect(() => {
    // Bottom tabs stay mounted, so ordinary tab switches preserve in-flight loads.
    // Cleanup runs only when this screen is truly removed/reset.
    return dispose;
  }, [dispose]);

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

  const slots = { a: slotA, b: slotB };
  const bothEmpty = !slotA.location && !slotB.location;

  return (
    <Screen padded={false}>
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.md },
        ]}
      >
        {bothEmpty ? (
          <Text style={{ color: theme.colors.textMuted, lineHeight: 20 }}>
            Pick two places from favorites, search, or Today to compare
            conditions without changing your main forecast.
          </Text>
        ) : null}

        <View style={[styles.slots, sideBySide && styles.slotsRow]}>
          {SLOT_IDS.map((id) => (
            <View
              key={id}
              style={[styles.slotWrap, sideBySide && styles.slotHalf]}
            >
              <CompareSlotCard
                slotId={id}
                slot={slots[id]}
                unit={unit}
                onPick={(location: WeatherLocation) => {
                  void loadSlot(id, location);
                }}
                onClear={() => clearSlot(id)}
                onRetry={() => void retrySlot(id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  slots: {
    gap: 12,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  slotWrap: {
    minWidth: 0,
  },
  slotHalf: {
    flex: 1,
  },
});
