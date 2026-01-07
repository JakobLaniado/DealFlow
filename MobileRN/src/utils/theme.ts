// DealFlow Design System
export const colors = {
  primary: '#1E3A5F', // Dark blue
  primaryLight: '#2E4A6F',
  secondary: '#00C853', // Green
  secondaryLight: '#4CAF50',
  white: '#FFFFFF',
  background: '#FFFFFF',
  text: '#1E3A5F',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  shadow: '#000000',
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
};

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



