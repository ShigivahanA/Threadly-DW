import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

const SCREEN_WIDTH = Dimensions.get('window').width
const GAP = spacing.md
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - GAP) / 2

const SkeletonElement = ({ style, theme }: any) => {
  const opacity = useSharedValue(0.3)
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    )
  }, [])
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  return (
    <Animated.View style={[
      style,
      { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
      animatedStyle
    ]} />
  )
}

export default function WardrobeSkeleton() {
  const { theme } = useTheme()
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={[styles.card, { width: CARD_WIDTH }]}>
          {/* Image Placeholder */}
          <SkeletonElement theme={theme} style={styles.image} />

          {/* Internal Meta */}
          <SkeletonElement theme={theme} style={styles.cat} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    borderRadius: 12, // Match WardrobeCard
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  cat: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 60,
    height: 14,
    borderRadius: 4,
  },
})
