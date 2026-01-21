import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function TabsLayout() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const isDark = theme === 'dark'
  const isIOS = Platform.OS === 'ios'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },

        // ✅ SOLID on Android, TRANSPARENT on iOS
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isIOS
              ? 'transparent'
              : colors.background,
            borderTopColor: colors.border,
          },
        ],

        // ✅ BLUR ONLY ON iOS
        tabBarBackground: isIOS
          ? () => (
              <BlurView
                tint={isDark ? 'dark' : 'light'}
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            )
          : undefined,
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Wardrobe',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pairing"
        options={{
          title: 'Pairing',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cloud-upload-outline"
              size={size + 4}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0.5,
    elevation: 16, // Android shadow only
  },
})
