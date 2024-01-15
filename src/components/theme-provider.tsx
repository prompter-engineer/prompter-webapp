import { useSettingStore } from '@/store/setting'
import { createContext, useContext, useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeProviderState {
  theme: string
}

const initialState = {
  theme: 'system'
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider ({
  children,
  ...props
}: ThemeProviderProps) {
  const theme = useSettingStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) { throw new Error('useTheme must be used within a ThemeProvider') }

  return context
}
