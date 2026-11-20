import { use } from 'react'
import { ThemeModeContext, type ThemeModeContextValue } from './ThemeModeContext'

export function useThemeMode(): ThemeModeContextValue {
  const value = use(ThemeModeContext)
  if (value === null) {
    throw new Error('useThemeMode must be used inside <ThemeModeProvider>')
  }
  return value
}
