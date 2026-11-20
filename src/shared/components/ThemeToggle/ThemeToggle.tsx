import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { STRINGS, THEME_MODE } from '@/constants'
import { useThemeMode } from '@/theme'

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()
  const isDark = mode === THEME_MODE.dark

  return (
    <Button
      type="text"
      shape="circle"
      onClick={toggleMode}
      aria-label={isDark ? STRINGS.theme.toLight : STRINGS.theme.toDark}
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
    />
  )
}
