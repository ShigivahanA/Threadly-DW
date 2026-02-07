import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function TabsLayout() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
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
          fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
          fontSize: normalize(10),
          fontWeight: '700',
          letterSpacing: 1,
          marginBottom: isIOS ? 0 : 4,
        },

        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 64 + insets.bottom,
          backgroundColor: isIOS ? 'transparent' : colors.background,
          paddingBottom: insets.bottom || 12,
          paddingTop: 12,
          elevation: 0,
        },

        tabBarBackground: () => (
          isIOS ? (
            <BlurView
              tint={isDark ? 'dark' : 'light'}
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: colors.background,
                  opacity: 0.98,
                  borderTopWidth: 1,
                  borderTopColor: colors.border
                }
              ]}
            />
          )
        ),
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'ARCHIVE',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "cube" : "cube-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pairing"
        options={{
          title: 'STUDIO',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "layers" : "layers-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: 'UPLINK',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'IDENTITY',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

