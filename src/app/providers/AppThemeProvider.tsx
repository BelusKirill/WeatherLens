import { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import {
  ThemeProvider,
  darkTheme,
  lightTheme,
  useThemePreferenceStore,
} from '@/core/theme';

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const preference = useThemePreferenceStore((state) => state.preference);
  const hasHydrated = useThemePreferenceStore((state) => state.hasHydrated);

  // Until persist rehydrates, follow system to avoid a wrong manual flash.
  const effective = hasHydrated ? preference : 'system';
  const resolved =
    effective === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : effective;

  const theme = resolved === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme} colorScheme={resolved}>
      {children}
    </ThemeProvider>
  );
}
