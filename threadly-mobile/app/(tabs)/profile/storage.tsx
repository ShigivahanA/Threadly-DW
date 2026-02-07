import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { BlurView } from 'expo-blur'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

export default function StorageScreen() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()

  // Ambient Blobs
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 11000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Blobs */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#7e22ce' : '#d8b4fe',
            top: -150, right: -50, width: 450, height: 450, opacity: 0.1,
          },
          blob1Style
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#be123c' : '#fda4af',
            bottom: -100, left: -100, width: 350, height: 350, opacity: 0.1,
          },
          blob2Style
        ]}
      />

      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Animated.View
          entering={FadeInDown.duration(800).easing(Easing.out(Easing.cubic))}
          style={[
            styles.iconWrap,
            {
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
            },
          ]}
        >
          <Ionicons
            name="server-outline"
            size={40}
            color={colors.textPrimary}
          />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(100).duration(800).easing(Easing.out(Easing.cubic))}
          style={[styles.title, { color: colors.textPrimary }]}
        >
          Storage
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(200).duration(800).easing(Easing.out(Easing.cubic))}
          style={[styles.text, { color: colors.textSecondary }]}
        >
          Storage insights and controls are currently under
          construction. This section will help you understand how
          your data is stored and managed locally and in the cloud.
        </Animated.Text>

        {/* Action */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).easing(Easing.out(Easing.cubic))}>
          <Pressable
            onPress={goBack}
            hitSlop={8}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.textPrimary },
              ]}
            >
              Return to Profile
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
    opacity: 0.8
  },

  button: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
})
