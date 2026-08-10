import { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { ThemeProvider, darkTheme, lightTheme } from '@/core/theme';

export function AppThemeProvider({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
