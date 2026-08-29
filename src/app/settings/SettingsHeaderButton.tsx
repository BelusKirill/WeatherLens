import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useAppTheme } from '@/core/theme';

import { useSettings } from './SettingsContext';

export function SettingsHeaderButton() {
  const theme = useAppTheme();
  const { openSettings } = useSettings();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open settings"
      hitSlop={10}
      onPress={openSettings}
      style={styles.button}
    >
      <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    padding: 4,
  },
});
