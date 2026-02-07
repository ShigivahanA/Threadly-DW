import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  Layout
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useEffect } from 'react'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import * as Haptics from 'expo-haptics'

export default function FavouriteEmpty() {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  // Blobs
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1Y.value = withRepeat(
      withSequence(withTiming(-20, { duration: 6000, easing: Easing.inOut(Easing.quad) }), withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.quad) })), -1, true
    )
    blob2Y.value = withRepeat(
      withSequence(withTiming(30, { duration: 8000, easing: Easing.inOut(Easing.quad) }), withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.quad) })), -1, true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))


  return (
    <View style={styles.container}>
      {/* Local Blobs for empty state focus */}
      <Animated.View style={[styles.blob, { backgroundColor: theme === 'dark' ? '#be123c' : '#fda4af', top: -50, right: -50, width: 200, height: 200, opacity: 0.15 }, blob1Style]} />
      <Animated.View style={[styles.blob, { backgroundColor: theme === 'dark' ? '#7e22ce' : '#d8b4fe', bottom: -50, left: -50, width: 250, height: 250, opacity: 0.15 }, blob2Style]} />

      <Animated.View
        entering={FadeInUp.duration(600).easing(Easing.out(Easing.cubic))}
        style={[styles.card, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
      >
        <BlurView intensity={50} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.glassContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <Ionicons name="heart-outline" size={32} color={colors.textSecondary} />
          </View>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Your collection of favourites is looking a bit empty.
          </Text>

          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync()
              router.push('/wardrobe')
            }}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme === 'dark' ? '#fff' : '#000',
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <Text style={[styles.buttonText, { color: theme === 'dark' ? '#000' : '#fff' }]}>
              Explore Wardrobe
            </Text>
          </Pressable>
        </BlurView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glassContent: {
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: normalize(14),
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 240,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: normalize(13),
    fontWeight: '600',
  },
})
