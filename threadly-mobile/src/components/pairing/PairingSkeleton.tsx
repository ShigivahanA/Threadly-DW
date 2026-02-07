import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const H_PADDING = spacing.xl * 2
const CONTENT_WIDTH = SCREEN_WIDTH - H_PADDING
const CARD_WIDTH = Math.round(CONTENT_WIDTH * 0.92)

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

export default function PairingSkeleton() {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonElement theme={theme} style={styles.title} />
      </View>

      {/* Rows */}
      <View style={styles.rows}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.rowWrapper}>
            <SkeletonElement theme={theme} style={styles.label} />

            <View style={styles.carouselRow}>
              {/* Left Peek */}
              <SkeletonElement theme={theme} style={[styles.card, { width: CARD_WIDTH, transform: [{ scale: 0.85 }, { translateX: -40 }] }]} />

              {/* Center Card */}
              <SkeletonElement theme={theme} style={[styles.card, { width: CARD_WIDTH, position: 'absolute', zIndex: 10 }]} />

              {/* Right Peek */}
              <SkeletonElement theme={theme} style={[styles.card, { width: CARD_WIDTH, transform: [{ scale: 0.85 }, { translateX: 40 }] }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    width: 120,
    height: 24,
    borderRadius: 6,
  },
  rows: {
    gap: 32,
    width: '100%',
    alignItems: 'center',
  },
  rowWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  label: {
    width: 80,
    height: 10,
    borderRadius: 4,
  },
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_WIDTH * (4 / 3) * 0.9, // approx height based on Aspect Ratio
    width: SCREEN_WIDTH,
  },
  card: {
    aspectRatio: 3 / 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  }
})
