import { App as AntdApp, ConfigProvider } from 'antd'
import { useMemo, type ReactNode } from 'react'
import { buildAntdTheme, useThemeMode } from '@/theme'

export function AntdThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode()
  const themeConfig = useMemo(() => buildAntdTheme(mode), [mode])

  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
