import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      children={
        <>
          <Slot />
          <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
          />
        </>
      }
    />
  )
}
