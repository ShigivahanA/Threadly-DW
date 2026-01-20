// app/(tabs)/PillTabBar.tsx
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef } from 'react'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const TABS = ['Wardrobe', 'Pairing', 'Upload', 'Profile']

export function PillTabBar({ state, navigation, theme }: any) {
  const dark = theme === 'dark'
  const insets = useSafeAreaInsets()

  /* ---------------------------
     Constants (lock layout)
  ---------------------------- */
  const TAB_WIDTH = 88

  /* ---------------------------
     Animated values
  ---------------------------- */
  const pillX = useSharedValue(0)

  /* ---------------------------
     Layout tracking (x only)
  ---------------------------- */
  const layoutsRef = useRef<{ x: number }[]>([])

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }))

  const movePill = (index: number) => {
    const layout = layoutsRef.current[index]
    if (!layout) return

    pillX.value = withTiming(layout.x, { duration: 220 })
  }

  const onTabLayout =
    (index: number) => (e: LayoutChangeEvent) => {
      layoutsRef.current[index] = {
        x: e.nativeEvent.layout.x,
      }

      if (state.index === index) {
        movePill(index)
      }
    }

  useEffect(() => {
    movePill(state.index)
  }, [state.index])

  /* ---------------------------
     Colors
  ---------------------------- */
  const barBg = dark ? '#2a2a2a' : '#000'
  const pillBg = dark ? '#3a3a3a' : '#fff'
  const activeColor = dark ? '#fff' : '#000'
  const inactiveColor = 'rgba(255,255,255,0.6)'

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 70 : 25}
        tint={dark ? 'dark' : 'light'}
        style={[styles.bar, { backgroundColor: barBg }]}
      >
        {/* Active pill */}
        <Animated.View
          style={[
            styles.activePill,
            {
              backgroundColor: pillBg,
              width: TAB_WIDTH,
            },
            pillStyle,
          ]}
        />

        {TABS.map((label, index) => {
          const focused = state.index === index

          return (
            <Pressable
              key={label}
              onLayout={onTabLayout(index)}
              onPress={() => {
                Haptics.selectionAsync()
                navigation.navigate(label.toLowerCase())
              }}
              style={[
                styles.tab,
                { width: TAB_WIDTH },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: focused
                      ? activeColor
                      : inactiveColor,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </BlurView>
    </View>
  )
}

/* ---------------------------
   Styles
---------------------------- */
const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 32,
    marginHorizontal: 16,
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    height: 48,
    borderRadius: 24,
    left: 0,
    top: 8,
  },
  tab: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
})
