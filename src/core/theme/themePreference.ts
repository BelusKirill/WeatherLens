export type ThemePreference = 'system' | 'light' | 'dark';

export function sanitizeThemePreference(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : 'system';
}
