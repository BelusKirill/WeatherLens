import { createContext, PropsWithChildren, useContext } from 'react';

import { AppTheme, lightTheme } from './tokens';

export type AppColorScheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: AppTheme;
  colorScheme: AppColorScheme;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  colorScheme: 'light',
});

export function ThemeProvider({
  theme,
  colorScheme,
  children,
}: PropsWithChildren<{ theme: AppTheme; colorScheme: AppColorScheme }>) {
  return (
    <ThemeContext.Provider value={{ theme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext).theme;
}

export function useAppColorScheme() {
  return useContext(ThemeContext).colorScheme;
}
