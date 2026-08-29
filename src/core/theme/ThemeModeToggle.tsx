import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from './ThemeContext';
import type { ThemePreference } from './themePreference';
import { useThemePreferenceStore } from './themePreferenceStore';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeModeToggle() {
  const theme = useAppTheme();
  const preference = useThemePreferenceStore((state) => state.preference);
  const setPreference = useThemePreferenceStore((state) => state.setPreference);

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {OPTIONS.map((option) => {
        const selected = preference === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label} theme`}
            onPress={() => setPreference(option.value)}
            style={[
              styles.option,
              selected && { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text
              style={{
                color: selected ? '#FFFFFF' : theme.colors.textMuted,
                fontWeight: selected ? '700' : '500',
                fontSize: 14,
              }}
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
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    gap: 2,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
});
