// DealFlow Design System - Light & Dark Theme Support

export type ThemeColors = typeof darkColors;

// Dark Theme Colors
export const darkColors = {
  // Primary brand colors
  primary: '#2563EB', // Vibrant blue (main accent)
  primaryLight: '#3B82F6', // Lighter blue for hover states
  primaryDark: '#1D4ED8', // Darker blue for pressed states

  // Secondary accent
  secondary: '#10B981', // Emerald green for success
  secondaryLight: '#34D399',

  // Background colors
  background: '#0F172A', // Deep navy background
  backgroundSecondary: '#1E293B', // Slightly lighter for inputs
  backgroundTertiary: '#334155', // For elevated elements

  // Surface colors
  surface: '#1E293B', // Card backgrounds
  surfaceLight: '#334155', // Elevated surfaces

  // Text colors
  text: '#F8FAFC', // Primary text (almost white)
  textSecondary: '#94A3B8', // Secondary text (slate)
  textMuted: '#64748B', // Muted text
  textLight: '#CBD5E1', // Light text for subtitles

  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  border: '#334155', // Border color
  borderLight: '#475569', // Lighter border
  divider: '#1E293B', // Divider lines

  // Status colors
  success: '#10B981', // Green
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  info: '#3B82F6', // Blue

  // Shadow
  shadow: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Light Theme Colors
export const lightColors: ThemeColors = {
  // Primary brand colors (same as dark)
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',

  // Secondary accent (same as dark)
  secondary: '#10B981',
  secondaryLight: '#34D399',

  // Background colors
  background: '#F8FAFC', // Light gray background
  backgroundSecondary: '#FFFFFF', // White for inputs
  backgroundTertiary: '#F1F5F9', // Slightly darker for elevated

  // Surface colors
  surface: '#FFFFFF', // White card backgrounds
  surfaceLight: '#F1F5F9', // Light gray surfaces

  // Text colors
  text: '#0F172A', // Dark navy text
  textSecondary: '#64748B', // Gray secondary text
  textMuted: '#94A3B8', // Muted text
  textLight: '#475569', // Darker for subtitles

  // UI colors
  white: '#FFFFFF',
  black: '#000000',
  border: '#E2E8F0', // Light border
  borderLight: '#CBD5E1', // Even lighter border
  divider: '#E2E8F0', // Light divider

  // Status colors (same as dark)
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Shadow
  shadow: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Get colors based on theme
export const getColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};

// Default export (dark theme for backwards compatibility)
export const colors = darkColors;

// Typography factory
export const getTypography = (themeColors: ThemeColors) => ({
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: themeColors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: themeColors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: themeColors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: themeColors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: themeColors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: themeColors.white,
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: themeColors.textMuted,
  },
});

// Default typography (dark theme)
export const typography = getTypography(darkColors);

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadow styles
export const getShadows = (themeColors: ThemeColors) => ({
  sm: {
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export const shadows = getShadows(darkColors);



