import { Tabs } from 'expo-router'
import { useTheme } from '@/src/theme/ThemeProvider'
import {PillTabBar} from '@/app/(tabs)/PillTabBar'

export default function TabsLayout() {
  const { theme } = useTheme()

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <PillTabBar {...props} theme={theme} />}
    >
      <Tabs.Screen name="wardrobe" />
      <Tabs.Screen name="pairing" />
      <Tabs.Screen name="upload" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
