import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BRAND, DARK_MODE_MEDIA_QUERY, STORAGE_KEYS, THEME_MODE, type ThemeMode } from '@/constants'
import { ThemeModeContext, type ThemeModeContextValue } from './ThemeModeContext'

function isThemeMode(value: string | null): value is ThemeMode {
  return value === THEME_MODE.light || value === THEME_MODE.dark
}

function readInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.themeMode)
    if (isThemeMode(stored)) return stored
  } catch {
    // Storage can be unavailable (private mode); fall back to the system preference.
  }
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? THEME_MODE.dark : THEME_MODE.light
}

function persistMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.themeMode, mode)
  } catch {
    // The toggle still works for this visit.
  }
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readInitialMode)

  const toggleMode = useCallback(() => {
    setMode((current) => (current === THEME_MODE.dark ? THEME_MODE.light : THEME_MODE.dark))
  }, [])

  // Sync with external systems: storage and the document root.
  useEffect(() => {
    persistMode(mode)
    const root = document.documentElement
    root.dataset.theme = mode
    root.style.colorScheme = mode
    root.style.background = mode === THEME_MODE.dark ? BRAND.paperDark : BRAND.paperLight
  }, [mode])

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, toggleMode }), [mode, toggleMode])

  return <ThemeModeContext value={value}>{children}</ThemeModeContext>
}
