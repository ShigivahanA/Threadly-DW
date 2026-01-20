import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ThemeProvider as AppThemeProvider, useTheme } from '@/src/theme/ThemeProvider'

function NavigationTheme() {
  const { theme } = useTheme()

  return (
    <ThemeProvider
      value={theme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <>
        <Slot />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </>
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <NavigationTheme />
      </AppThemeProvider>
    </GestureHandlerRootView>
  )
}
