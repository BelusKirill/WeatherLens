import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeModeToggle, useAppTheme } from '@/core/theme';

import { useSettings } from './SettingsContext';

const DRAWER_WIDTH = 300;
const ANIM_MS = 220;

export function SettingsDrawer() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { open, closeSettings } = useSettings();
  const progress = useSharedValue(0);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const drawerWidth = Math.min(DRAWER_WIDTH, windowWidth * 0.88);

  const finishClose = useCallback(() => {
    mountedRef.current = false;
    setMounted(false);
  }, []);

  useEffect(() => {
    if (open) {
      mountedRef.current = true;
      setMounted(true);
      progress.value = withTiming(1, {
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (!mountedRef.current) {
      return;
    }

    progress.value = withTiming(
      0,
      { duration: ANIM_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      },
    );
  }, [finishClose, open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.45,
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - progress.value) * drawerWidth }],
  }), [drawerWidth]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={closeSettings}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close settings"
          style={StyleSheet.absoluteFill}
          onPress={closeSettings}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: '#000000' },
              backdropStyle,
            ]}
          />
        </Pressable>

        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              backgroundColor: theme.colors.surface,
              borderLeftColor: theme.colors.border,
            },
            drawerStyle,
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Settings
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              hitSlop={8}
              onPress={closeSettings}
            >
              <Text style={{ color: theme.colors.textMuted, fontWeight: '600' }}>
                Close
              </Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              Appearance
            </Text>
            <Text
              style={{
                color: theme.colors.text,
                marginBottom: 12,
                lineHeight: 20,
              }}
            >
              Choose system, light, or dark. Preference is saved on this device.
            </Text>
            <ThemeModeToggle />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: 20,
    borderLeftWidth: StyleSheet.hairlineWidth,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
