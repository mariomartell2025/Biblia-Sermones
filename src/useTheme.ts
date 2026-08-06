import { useMemo } from 'react';
import { getTheme, ThemeColors } from './theme';
import { useSettings } from './SettingsContext';

export function useTheme(): ThemeColors {
  const settings = useSettings();
  return useMemo(() => getTheme(settings.theme), [settings.theme]);
}
