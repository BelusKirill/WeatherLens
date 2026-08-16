import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/core/theme';

import type { TemperatureUnit } from '../model/types';

type UnitToggleProps = {
  unit: TemperatureUnit;
  onToggle: () => void;
  disabled?: boolean;
};

export function UnitToggle({ unit, onToggle, disabled }: UnitToggleProps) {
  const theme = useAppTheme();
  const isMetric = unit === 'metric';

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isMetric, disabled }}
        disabled={disabled}
        onPress={() => {
          if (!isMetric) {
            onToggle();
          }
        }}
        style={[
          styles.chip,
          isMetric && { backgroundColor: theme.colors.accent },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: isMetric ? '#FFFFFF' : theme.colors.textMuted },
          ]}
        >
          °C
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: !isMetric, disabled }}
        disabled={disabled}
        onPress={() => {
          if (isMetric) {
            onToggle();
          }
        }}
        style={[
          styles.chip,
          !isMetric && { backgroundColor: theme.colors.accent },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: !isMetric ? '#FFFFFF' : theme.colors.textMuted },
          ]}
        >
          °F
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  label: { fontSize: 14, fontWeight: '600' },
});
