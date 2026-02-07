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
import { useTheme } from '@/src/theme/ThemeProvider'
import { spacing } from '@/src/theme/spacing'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.6

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

export default function OutfitDetailSkeleton() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      {/* Header Mock */}
      <View style={styles.header}>
        <View />
        <View style={{ alignItems: 'center', gap: 6 }}>
          <SkeletonElement theme={theme} style={{ width: 100, height: 24, borderRadius: 4 }} />
          <SkeletonElement theme={theme} style={{ width: 60, height: 12, borderRadius: 2 }} />
        </View>
        <View />
      </View>

      {/* Blueprint Stage Mock */}
      <View style={styles.stage}>
        {/* Thread Line */}
        <View style={[styles.threadLine, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} />

        {/* Staggered Items */}
        <View style={{ alignSelf: 'flex-start', marginLeft: spacing.lg }}>
          <SkeletonElement theme={theme} style={styles.card} />
        </View>

        <View style={{ alignSelf: 'flex-end', marginRight: spacing.lg, marginTop: -40 }}>
          <SkeletonElement theme={theme} style={styles.card} />
        </View>

        <View style={{ alignSelf: 'center', marginTop: -40 }}>
          <SkeletonElement theme={theme} style={styles.card} />
        </View>
      </View>

      {/* Specs Mock */}
      <View style={[styles.specs, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.specRow}>
            <SkeletonElement theme={theme} style={{ width: 60, height: 10, borderRadius: 2 }} />
            <SkeletonElement theme={theme} style={{ width: 120, height: 14, borderRadius: 2 }} />
          </View>
        ))}

        <SkeletonElement theme={theme} style={styles.button} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    marginBottom: 40,
  },
  stage: {
    position: 'relative',
    marginBottom: 40,
  },
  threadLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 3 / 4,
    borderRadius: 20,
  },
  specs: {
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    gap: 20,
  },
  specRow: {
    gap: 8,
  },
  button: {
    height: 52,
    borderRadius: 14,
    marginTop: 12,
  }
})
