import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/core/theme';

import type { TemperatureUnit } from '../model/types';

type UnitToggleProps = {
  unit: TemperatureUnit;
  onToggle: () => void;
  disabled?: boolean;
};

const OPTIONS: Array<{ id: TemperatureUnit; label: string }> = [
  { id: 'metric', label: '°C' },
  { id: 'imperial', label: '°F' },
];

export function UnitToggle({ unit, onToggle, disabled }: UnitToggleProps) {
  const theme = useAppTheme();

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
      {OPTIONS.map((option) => {
        const selected = unit === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            disabled={disabled || selected}
            onPress={onToggle}
            style={[
              styles.chip,
              selected && { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: selected ? '#FFFFFF' : theme.colors.textMuted,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
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
