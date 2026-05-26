import { useThemeStore } from '../store/themeStore'
import { THEMES } from '../lib/themes'

export function useTheme() {
  const theme = useThemeStore(s => s.theme)
  return THEMES[theme] ?? THEMES.dark
}
