import { theme, type ThemeConfig } from 'antd'
import { BORDER_RADIUS, BRAND, FONT_FAMILY, THEME_MODE, type ThemeMode } from '@/constants'

export function buildAntdTheme(mode: ThemeMode): ThemeConfig {
  const isDark = mode === THEME_MODE.dark
  return {
    cssVar: {},
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? BRAND.primaryDark : BRAND.primaryLight,
      colorBgLayout: isDark ? BRAND.paperDark : BRAND.paperLight,
      colorBgContainer: isDark ? BRAND.surfaceDark : BRAND.surfaceLight,
      fontFamily: FONT_FAMILY.sans,
      borderRadius: BORDER_RADIUS,
    },
  }
}
