import { useTheme } from '@/contexts/ThemeContext';
import {
  getColors,
  getShadows,
  getTypography,
  ThemeColors,
} from '@/utils/theme';
import { useMemo } from 'react';

export function useThemedColors(): ThemeColors {
  const { isDark } = useTheme();
  return useMemo(() => getColors(isDark), [isDark]);
}

export function useThemedTypography() {
  const colors = useThemedColors();
  return useMemo(() => getTypography(colors), [colors]);
}

export function useThemedShadows() {
  const colors = useThemedColors();
  return useMemo(() => getShadows(colors), [colors]);
}

// Combined hook for all theme values
export function useThemedStyles() {
  const { isDark, toggleTheme, theme } = useTheme();
  const colors = useMemo(() => getColors(isDark), [isDark]);
  const typography = useMemo(() => getTypography(colors), [colors]);
  const shadows = useMemo(() => getShadows(colors), [colors]);

  return {
    colors,
    typography,
    shadows,
    isDark,
    toggleTheme,
    theme,
  };
}

export default useThemedStyles;
