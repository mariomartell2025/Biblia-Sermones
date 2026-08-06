import { Theme } from './settings';

export type ThemeColors = {
  bg: string;
  bgElevated: string;
  card: string;
  cardBorder: string;
  header: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  danger: string;
  radius: number;
};

const THEMES: Record<Theme, ThemeColors> = {
  dark: {
    bg: '#0f1420',
    bgElevated: '#161d2b',
    card: '#1a2233',
    cardBorder: '#26314a',
    header: '#0b1018',
    text: '#e8ecf4',
    textMuted: '#9aa4b8',
    accent: '#6ea8fe',
    accentText: '#0b1018',
    danger: '#ff6b6b',
    radius: 16,
  },
  light: {
    bg: '#f5f5f7',
    bgElevated: '#ffffff',
    card: '#f9f9fb',
    cardBorder: '#e5e5e7',
    header: '#ffffff',
    text: '#1d1d1f',
    textMuted: '#86868b',
    accent: '#0071e3',
    accentText: '#ffffff',
    danger: '#ff3b30',
    radius: 16,
  },
  sepia: {
    bg: '#f4eee0',
    bgElevated: '#faf6f0',
    card: '#fdf9f3',
    cardBorder: '#e8dfd3',
    header: '#f4eee0',
    text: '#3e3b37',
    textMuted: '#8b8680',
    accent: '#b8860b',
    accentText: '#f4eee0',
    danger: '#d32f2f',
    radius: 16,
  },
};

export function getTheme(themeName: Theme): ThemeColors {
  return THEMES[themeName];
}

// Default: dark theme
export const theme = THEMES.dark;
