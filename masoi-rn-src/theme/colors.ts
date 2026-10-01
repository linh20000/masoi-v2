// Nightfall Realm — Design System Colors
// Extracted from ui-mock Tailwind config (consistent across all screens)

export const Colors = {
  // Core
  primary: '#ffb3ae',
  onPrimary: '#68000c',
  primaryContainer: '#8a121a',
  onPrimaryContainer: '#ff958f',
  primaryFixed: '#ffdad7',
  primaryFixedDim: '#ffb3ae',
  onPrimaryFixed: '#410004',
  onPrimaryFixedVariant: '#8d141c',
  inversePrimary: '#ae2f30',

  // Secondary (Cyan/Teal)
  secondary: '#72d4ee',
  onSecondary: '#003641',
  secondaryContainer: '#329db6',
  onSecondaryContainer: '#002e38',
  secondaryFixed: '#afecff',
  secondaryFixedDim: '#72d4ee',
  onSecondaryFixed: '#001f27',
  onSecondaryFixedVariant: '#004e5d',

  // Tertiary (Gold)
  tertiary: '#f1be66',
  onTertiary: '#422c00',
  tertiaryContainer: '#5c3f00',
  onTertiaryContainer: '#dbaa54',
  tertiaryFixed: '#ffdeab',
  tertiaryFixedDim: '#f1be66',
  onTertiaryFixed: '#271900',
  onTertiaryFixedVariant: '#5f4100',

  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Surface
  surface: '#111317',
  surfaceDim: '#111317',
  surfaceBright: '#37393d',
  surfaceVariant: '#333538',
  onSurface: '#e2e2e6',
  onSurfaceVariant: '#e0bfbc',
  inverseSurface: '#e2e2e6',
  inverseOnSurface: '#2f3034',

  // Surface containers
  surfaceContainerLowest: '#0c0e11',
  surfaceContainerLow: '#1a1c1f',
  surfaceContainer: '#1e2023',
  surfaceContainerHigh: '#282a2d',
  surfaceContainerHighest: '#333538',

  // Outline
  outline: '#a78a87',
  outlineVariant: '#59413f',

  // Background
  background: '#111317',
  onBackground: '#e2e2e6',

  // Semantic aliases
  surfaceTint: '#ffb3ae',
};

export const Fonts = {
  cinzel: 'Cinzel',
  inter: 'Inter',
  jetBrainsMono: 'JetBrainsMono',
};

export const FontSizes = {
  displayLgMobile: 32,
  headlineLgMobile: 24,
  headlineLg: 30,
  headlineMd: 22,
  headlineSm: 18,
  titleMd: 16,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
  labelMd: 13,
  labelSm: 11,
  timerDisplayMobile: 20,
  timerDisplay: 28,
};

export const Spacing = {
  xs: 4,    // space-xs: 0.25rem
  sm: 8,    // space-sm: 0.5rem
  gutterMobile: 8,  // gutter-mobile: 0.5rem
  md: 16,   // space-md: 1rem
  gutter: 16,       // gutter: 1rem
  marginMobile: 12, // margin-mobile: 0.75rem
  lg: 24,   // space-lg: 1.5rem
  margin: 32,       // margin: 2rem
  xl: 40,   // space-xl: 2.5rem
};

export const BorderRadius = {
  sm: 2,    // DEFAULT: 0.125rem
  md: 4,    // lg: 0.25rem
  lg: 8,    // xl: 0.5rem
  full: 12, // full: 0.75rem
  circle: 999,
};
