export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    danger: string;
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export const lightTheme: AppTheme = {
  colors: {
    background: '#F2F6FA',
    surface: '#FFFFFF',
    text: '#0B1F33',
    textMuted: '#5B6B7C',
    accent: '#1F6FEB',
    danger: '#C62828',
    border: '#D7E0EA',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
};

export const darkTheme: AppTheme = {
  colors: {
    background: '#071421',
    surface: '#0B1F33',
    text: '#E8EEF5',
    textMuted: '#9AA8B5',
    accent: '#6AA8FF',
    danger: '#EF9A9A',
    border: '#1C334A',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
};
