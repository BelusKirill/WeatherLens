import { createContext, PropsWithChildren, useContext } from 'react';

import { AppTheme, lightTheme } from './tokens';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({
  theme,
  children,
}: PropsWithChildren<{ theme: AppTheme }>) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
