import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'

export default function TabsLayout() {
  const scheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? '#0a0a0a' : '#ffffff',
        },
        tabBarActiveTintColor: scheme === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{ title: 'Wardrobe' }}
      />
      <Tabs.Screen
        name="pairing"
        options={{ title: 'Pairing' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  )
}
