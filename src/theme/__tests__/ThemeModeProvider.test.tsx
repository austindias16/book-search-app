import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { STORAGE_KEYS, THEME_MODE } from '@/constants'
import { ThemeModeProvider, useThemeMode } from '@/theme'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeModeProvider>{children}</ThemeModeProvider>
)

describe('ThemeModeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('toggles the mode, updates the document, and persists the choice', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper })
    const initial = result.current.mode

    act(() => result.current.toggleMode())

    const next = initial === THEME_MODE.dark ? THEME_MODE.light : THEME_MODE.dark
    expect(result.current.mode).toBe(next)
    expect(document.documentElement.dataset.theme).toBe(next)
    expect(localStorage.getItem(STORAGE_KEYS.themeMode)).toBe(next)
  })

  it('restores a stored choice on mount', () => {
    localStorage.setItem(STORAGE_KEYS.themeMode, THEME_MODE.dark)
    const { result } = renderHook(() => useThemeMode(), { wrapper })
    expect(result.current.mode).toBe(THEME_MODE.dark)
  })

  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useThemeMode())).toThrow(/ThemeModeProvider/)
    spy.mockRestore()
  })
})
