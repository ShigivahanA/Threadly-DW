import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Platform } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import { useLayoutEffect  } from 'react'
import { ThemeProvider as AppThemeProvider, useTheme } from '@/src/theme/ThemeProvider'
import { ToastProvider } from '@/src/components/Toast/ToastProvider'
import { lightColors,darkColors } from '@/src/theme/colors'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'


function NavigationTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useLayoutEffect(() => {
    if (Platform.OS !== 'android') return

    NavigationBar.setButtonStyleAsync(
      isDark ? 'light' : 'dark'
    )
  }, [isDark])

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <>
        <Slot />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    </ThemeProvider>
  )
}

function ThemedRoot() {
  const { theme } = useTheme()

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor:
          theme === 'dark'
            ? darkColors.background
            : lightColors.background,
      }}
    >
      <ActionSheetProvider>
      <ToastProvider>
        <NavigationTheme />
      </ToastProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  )
}


export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ThemedRoot />
    </AppThemeProvider>
  )
}

