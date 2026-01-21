// app/index.tsx
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { typography } from '@/src/theme/typography'
import { bootstrapAuth } from '@/src/services/authBootstrap'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')
const SHORT_EDGE = Math.min(width, height)

export default function Index() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  /* ---------------------------
     State
  ---------------------------- */
  const [splashDone, setSplashDone] = useState(false)
  const [authResult, setAuthResult] =
    useState<'logged-in' | 'logged-out' | null>(null)
  const [showGetStarted, setShowGetStarted] = useState(false)

  /* ---------------------------
     Animation values
  ---------------------------- */
  const splashScale = useSharedValue(1)
  const splashOpacity = useSharedValue(1)
  const contentOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(16)

  /* ---------------------------
     Splash animation
  ---------------------------- */
  useEffect(() => {
    splashScale.value = withTiming(
      Math.max(width, height) / 120,
      {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        runOnJS(setSplashDone)(true)
        contentOpacity.value = withTiming(1, { duration: 400 })
        contentTranslateY.value = withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      }
    )

    splashOpacity.value = withTiming(0, { duration: 700 })
  }, [])

  /* ---------------------------
     Auth bootstrap (once)
  ---------------------------- */
  useEffect(() => {
    const runBootstrap = async () => {
      const user = await bootstrapAuth()
      setAuthResult(user ? 'logged-in' : 'logged-out')
    }

    runBootstrap()
  }, [])

  /* ---------------------------
     Navigation decision
  ---------------------------- */
  useEffect(() => {
    if (!splashDone || !authResult) return

    if (authResult === 'logged-in') {
      router.replace('/(tabs)/wardrobe')
    } else {
      setShowGetStarted(true)
    }
  }, [splashDone, authResult])

  /* ---------------------------
     Animated styles
  ---------------------------- */
  const splashStyle = useAnimatedStyle(() => ({
    transform: [{ scale: splashScale.value }],
    opacity: splashOpacity.value,
  }))

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }))

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* SPLASH LOGO */}
      <Animated.View style={[styles.splashLogoContainer, splashStyle]}>
        <Image
          source={require('@/assets/splash-dark.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* GET STARTED CONTENT */}
      <Animated.View style={[styles.content, contentStyle]}>
        <Image
          source={require('@/assets/splash-dark.png')}
          style={styles.contentLogo}
          resizeMode="contain"
        />

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your wardrobe, reimagined
        </Text>

        {showGetStarted ? (
  <>
    <Pressable
      onPress={() => router.replace('/(auth)/login')}
      style={[styles.button, { backgroundColor: colors.textPrimary }]}
    >
      <Text style={[styles.buttonText, { color: colors.background }]}>
        Get Started
      </Text>
    </Pressable>

    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
      Mix outfits • Save looks • Style smarter
    </Text>
  </>
) : (
  <Text style={[styles.footerText, { color: colors.textSecondary }]}>
    Mix outfits • Save looks • Style smarter
  </Text>
)}

      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  splashLogoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
  },

  content: {
    alignItems: 'center',
    maxWidth: 420,
  },
  contentLogo: {
    width: SHORT_EDGE * 0.66,
    height: SHORT_EDGE * 0.66,
    marginBottom: spacing.lg,
  },

  subtitle: {
    ...typography.subtitle,
    fontSize: 22,
  lineHeight: 26,
  textAlign: 'center',
  marginBottom: spacing.xl,
  },

  button: {
    paddingVertical: spacing.lg,
  paddingHorizontal: spacing.xl,
  marginVertical: spacing.lg,
  borderRadius: 999,
  minWidth: 200,
  alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
  position: 'absolute',
  bottom: spacing.lg,
  left: spacing.xl,
  right: spacing.xl,
  alignItems: 'center',
},

footerText: {
  fontSize: 13,
  textAlign: 'center',
  opacity: 0.8,
},

})
