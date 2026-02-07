import { View, StyleSheet, FlatList, Dimensions } from 'react-native'
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
  columns: number
}

const SkeletonItem = ({ theme }: { theme: 'light' | 'dark' }) => {
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
      styles.card,
      { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
      animatedStyle
    ]} />
  )
}

export default function FavouriteSkeleton({ columns }: Props) {
  const { theme } = useTheme()
  const screenWidth = Dimensions.get('window').width
  const gap = 16
  const padding = 24
  // Calculate width same as actual grid
  const itemWidth = (screenWidth - (padding * 2) - (gap * (columns - 1))) / columns

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={{ width: itemWidth, height: itemWidth * 1.5, marginBottom: gap }}>
            <SkeletonItem theme={theme} />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
})
