export const THEME_MODE = { light: 'light', dark: 'dark' } as const
export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE]

export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const BRAND = {
  primaryLight: '#9a3b26',
  primaryDark: '#e08a6c',
  paperLight: '#f6f1e7',
  paperDark: '#16130f',
  surfaceLight: '#fffcf5',
  surfaceDark: '#211c16',
} as const

// Must match the --font-serif value in styles/global.css.
export const FONT_FAMILY = {
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
} as const

export const BORDER_RADIUS = 8

// Muted cloth-binding colours for books without a cover.
export const COVER_SPINE_COLORS = [
  '#7a4b3a',
  '#3f5a4c',
  '#46506b',
  '#6b5a3a',
  '#5b3f5e',
  '#3d5560',
] as const
export const COVER_TEXT_COLOR = '#f6efe2'
export const COVER_HASH_MULTIPLIER = 31
