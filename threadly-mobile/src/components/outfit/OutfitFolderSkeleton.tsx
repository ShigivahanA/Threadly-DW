import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { useTheme } from '@/src/theme/ThemeProvider'

type Props = {
  width?: number | string
}

const SkeletonElement = ({ style, theme }: any) => {
  const opacity = useSharedValue(0.3)
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
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

export default function OutfitFolderSkeleton({ width }: Props) {
  const { theme } = useTheme()

  return (
    <View style={[styles.card, { width: (width || '48%') as any }]}>
      {/* Preview Grid Skeleton */}
      <View style={styles.previewContainer}>
        <SkeletonElement theme={theme} style={{ flex: 1, marginRight: 2 }} />
        <SkeletonElement theme={theme} style={{ flex: 1, marginRight: 2 }} />
        <SkeletonElement theme={theme} style={{ flex: 1 }} />
      </View>

      {/* Meta Skeleton */}
      <View style={styles.meta}>
        <SkeletonElement theme={theme} style={{ width: '70%', height: 14, borderRadius: 4, marginBottom: 6 }} />
        <SkeletonElement theme={theme} style={{ width: '40%', height: 12, borderRadius: 4 }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'transparent', // maintain size layout
  },
  previewContainer: {
    height: 140,
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  meta: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
})
