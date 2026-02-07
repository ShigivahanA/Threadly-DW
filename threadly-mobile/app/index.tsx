// app/index.tsx
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { bootstrapAuth } from '@/src/services/authBootstrap'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
  interpolate,
  interpolateColor,
  FadeInDown,
  Extrapolation,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { normalize } from '@/src/utils/responsive'
import * as Haptics from 'expo-haptics'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

const { width, height } = Dimensions.get('window')

/* ------------------------------------------------------------------
   CONSTANTS & CONFIG
------------------------------------------------------------------ */
const BUTTON_HEIGHT = 64
const BUTTON_WIDTH = width * 0.8
const BUTTON_PADDING = 8
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING
const H_WAVE_OFFSET = SWIPEABLE_DIMENSIONS + BUTTON_PADDING
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS

/* ------------------------------------------------------------------
   COMPONENTS
------------------------------------------------------------------ */

export default function Index() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  // Auth State
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Animation Values
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)
  const introOpacity = useSharedValue(0)
  const introScale = useSharedValue(0.9)

  // Swipe State
  const X = useSharedValue(0)
  const isInteracting = useSharedValue(false)
  const [hasSwiped, setHasSwiped] = useState(false)

  /* ------------------------------------------------------------------
     INIT / AUTH CHECK
  ------------------------------------------------------------------ */
  useEffect(() => {
    // Start ambient animations immediately
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 7000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    )

    // Check Auth
    const init = async () => {
      // Simulate "Engine Loading" style delay or actual auth check
      const user = await bootstrapAuth()

      if (user) {
        setIsLoggedIn(true)
        // Short delay then auto-enter
        setTimeout(() => router.replace('/(tabs)/wardrobe'), 500)
      } else {
        setIsLoggedIn(false)
        setIsReady(true)
        // Anim In
        introOpacity.value = withTiming(1, { duration: 800 })
        introScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) })
      }
    }

    init()
  }, [])


  /* ------------------------------------------------------------------
     SWIPE LOGIC
  ------------------------------------------------------------------ */
  const animatedSensor = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: X.value }]
    }
  })

  // Knob Animation
  const knobStyle = useAnimatedStyle(() => {
    const rotate = interpolate(X.value, [0, H_SWIPE_RANGE], [0, 360], Extrapolation.CLAMP)
    const scale = isInteracting.value ? withSpring(1.1) : withSpring(1)

    return {
      transform: [
        { translateX: X.value },
        { rotate: `${rotate}deg` },
        { scale }
      ]
    }
  })

  // Track Text Fade
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(X.value, [0, H_SWIPE_RANGE / 2], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(X.value, [0, H_SWIPE_RANGE], [0, 20], Extrapolation.CLAMP) }
      ]
    }
  })


  const handleComplete = () => {
    runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success)
    runOnJS(setHasSwiped)(true)
    runOnJS(router.replace)('/(auth)/login')
  }

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isInteracting.value = true
      runOnJS(Haptics.selectionAsync)()
    })
    .onUpdate((e) => {
      X.value = Math.max(0, Math.min(e.translationX, H_SWIPE_RANGE))
    })
    .onEnd(() => {
      isInteracting.value = false
      if (X.value > H_SWIPE_RANGE * 0.75) {
        X.value = withTiming(H_SWIPE_RANGE, { duration: 200 }, () => {
          runOnJS(handleComplete)()
        })
      } else {
        X.value = withSpring(0, { damping: 15, stiffness: 120 })
      }
    })

  /* ------------------------------------------------------------------
     STYLES
  ------------------------------------------------------------------ */
  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))

  const containerStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [{ scale: introScale.value }]
  }))

  /* ------------------------------------------------------------------
     Staggered Title Component
  ------------------------------------------------------------------ */
  const Title = () => {
    const chars = "THREADLY".split("")
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {chars.map((char, i) => (
          <Animated.Text
            key={i}
            entering={FadeInDown.delay(300 + (i * 60)).duration(1000).easing(Easing.out(Easing.quad))} // Smoother, non-bouncy
            style={[
              styles.titleChar,
              { color: colors.textPrimary },
              i > 5 && { fontWeight: '300', fontStyle: 'italic' } // Make 'LY' different
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
    )
  }

  // If already logged in and just waiting to redirect, show simple loading
  if (isLoggedIn) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Animated.Text entering={FadeIn} exiting={FadeOut} style={{ color: colors.textSecondary, letterSpacing: 4, fontWeight: '600' }}>
          RESUMING...
        </Animated.Text>
      </View>
    )
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/*
           BACKGROUND LAYERS
        */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#be123c' : '#fb7185',
            top: -120, left: -50, width: 500, height: 500, opacity: 0.09,
          },
          blob1Style
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#4f46e5' : '#818cf8',
            bottom: -150, right: -80, width: 450, height: 450, opacity: 0.1,
          },
          blob2Style
        ]}
      />

      {/* MAIN CONTENT */}
      <Animated.View style={[styles.content, containerStyle]}>
        <View style={styles.hero}>
          {/* LOGO ADDED ABOVE TITLE */}
          <Animated.Image
            source={require('@/assets/splash-dark.png')}
            style={{ width: 80, height: 80, marginBottom: spacing.md }}
            resizeMode="contain"
            entering={FadeIn.duration(1000).easing(Easing.out(Easing.cubic))}
          />

          <Title />

          <Animated.View
            style={styles.taglineContainer}
            entering={FadeIn.delay(1000).duration(1200)}
          >
            <View style={[styles.line, { backgroundColor: colors.textPrimary }]} />
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
              Curate. Organize. Slay.
            </Text>
            <View style={[styles.line, { backgroundColor: colors.textPrimary }]} />
          </Animated.View>
        </View>

        {/* SWIPE BUTTON */}
        {isReady && !hasSwiped && (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[
              styles.swipeContainer,
              {
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT,
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
              }
            ]}>
              {/* Track Background */}
              <BlurView
                intensity={Platform.OS === 'ios' ? 30 : 0}
                tint={theme === 'dark' ? 'dark' : 'light'}
                style={[StyleSheet.absoluteFill, styles.trackGlass]}
              />

              {/* Track Text - zIndex fixed */}
              <Animated.View style={[styles.trackTextContainer, textStyle]}>
                <Text style={[styles.trackText, { color: colors.textSecondary }]}>
                  swipe to enter
                </Text>
                <Ionicons name="chevron-forward" size={12} color={colors.textSecondary} style={{ opacity: 0.6, marginLeft: 8 }} />
                <Ionicons name="chevron-forward" size={12} color={colors.textSecondary} style={{ opacity: 0.4 }} />
              </Animated.View>

              {/* Knob */}
              <Animated.View style={[
                styles.knob,
                knobStyle,
                { backgroundColor: theme === 'dark' ? '#fff' : '#000' }
              ]}>
                <View>
                  <Ionicons name="arrow-forward" size={20} color={theme === 'dark' ? '#000' : '#fff'} />
                </View>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        )}
      </Animated.View>

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '65%',
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleChar: {
    fontSize: normalize(56),
    fontWeight: '900',
    letterSpacing: -2,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: 12,
  },
  line: {
    width: 20,
    height: 1,
    opacity: 0.3,
  },
  subtitleText: {
    fontSize: normalize(13),
    letterSpacing: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  swipeContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    padding: BUTTON_PADDING,
    marginTop: 'auto',
    marginBottom: 50,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle borders
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  trackGlass: {
    borderRadius: 999,
  },
  trackTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 1, // Fix: Ensure text is on top of blur
  },
  trackText: {
    fontSize: normalize(11),
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  knob: {
    width: SWIPEABLE_DIMENSIONS,
    height: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 2, // Knob acts on top
  },
})
