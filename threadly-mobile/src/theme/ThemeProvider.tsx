import React, { createContext, useContext, useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import * as SecureStore from 'expo-secure-store'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = Appearance.getColorScheme() ?? 'light'
  const [theme, setThemeState] = useState<Theme>(systemTheme)

  useEffect(() => {
    ;(async () => {
      const saved = await SecureStore.getItemAsync('theme')
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved)
      }
    })()
  }, [])

  const setTheme = async (value: Theme) => {
    setThemeState(value)
    await SecureStore.setItemAsync('theme', value)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return ctx
}
