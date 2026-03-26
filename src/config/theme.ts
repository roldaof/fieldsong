export const colors = {
  surface: '#131313',
  surfaceContainerLow: '#1C1B1B',
  surfaceContainer: '#20201F',
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353535',
  surfaceLowest: '#0E0E0E',

  primary: '#F2CA50',
  primaryContainer: '#D4AF37',
  onPrimary: '#3C2F00',

  secondary: '#BFCDFF',
  secondaryContainer: '#353535',
  onSecondaryContainer: '#E8E2D6',

  textPrimary: '#E8E2D6',
  textSecondary: '#A09A8E',
  textMuted: '#6B6560',

  outline: '#4D4635',
  outlineVariant: 'rgba(77, 70, 53, 0.2)',

  error: '#CF6679',
  success: '#81C784',
};

export const gradients = {
  primary: ['#F2CA50', '#D4AF37'] as const,
};

export const fonts = {
  serif: {
    regular: 'Newsreader_400Regular',
    italic: 'Newsreader_400Regular_Italic',
    semiBold: 'Newsreader_600SemiBold',
    bold: 'Newsreader_700Bold',
  },
  sans: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semiBold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  displayLg: {
    fontFamily: fonts.serif.bold,
    fontSize: 40,
    lineHeight: 48,
  },
  displayMd: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 32,
    lineHeight: 40,
  },
  displaySm: {
    fontFamily: fonts.serif.italic,
    fontSize: 24,
    lineHeight: 32,
  },
  headlineLg: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineMd: {
    fontFamily: fonts.serif.regular,
    fontSize: 22,
    lineHeight: 30,
  },
  titleLg: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  titleMd: {
    fontFamily: fonts.sans.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLg: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  bodyMd: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  labelLg: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  labelMd: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  labelSm: {
    fontFamily: fonts.sans.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};
