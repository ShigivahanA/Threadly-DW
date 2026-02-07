import { useEffect, useState, useMemo, useCallback } from 'react'
import { StyleSheet, FlatList, Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated'

import wardrobeService from '@/src/services/wardrobeService'
import FavouriteHeader from '@/src/components/Favourite/FavouriteHeader'
import FavouriteSkeleton from '@/src/components/Favourite/FavouriteSkeleton'
import FavouriteEmpty from '@/src/components/Favourite/FavouriteEmpty'
import FavouriteGridItem from '@/src/components/Favourite/FavouriteGridItem'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

const GAP = spacing.lg

const getColumns = (width: number) => {
  if (width >= 900) return 3 // tablets
  return 2 // phones
}

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const TAB_BAR_HEIGHT = 64
  const screenWidth = Dimensions.get('window').width
  const columns = getColumns(screenWidth)

  // Ambient Blobs
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))

  const cardWidth = useMemo(() => {
    return (
      (screenWidth -
        spacing.xl * 2 -
        GAP * (columns - 1)) /
      columns
    )
  }, [screenWidth, columns])

  const ITEM_HEIGHT = cardWidth

  const fetchData = async () => {
    try {
      const res = await wardrobeService.getItems('?favorite=true')
      // Check for .items or similar structure if service returns wrapped
      // @ts-ignore
      const list = res?.items ?? (Array.isArray(res) ? res : [])
      setItems(list)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Blobs */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#7e22ce' : '#d8b4fe',
            top: -120, right: -120, width: 450, height: 450, opacity: 0.1,
          },
          blob1Style
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#be123c' : '#fda4af',
            bottom: -50, left: -100, width: 350, height: 350, opacity: 0.1,
          },
          blob2Style
        ]}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(600).easing(Easing.out(Easing.cubic))}
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm }
        ]}
      >
        <FavouriteHeader count={items.length} loading={loading} />
      </Animated.View>

      {/* Content */}
      {loading ? (
        <FavouriteSkeleton columns={columns} />
      ) : items.length === 0 ? (
        <FavouriteEmpty />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          numColumns={columns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            {
              paddingTop: spacing.sm,
              paddingBottom:
                insets.bottom + TAB_BAR_HEIGHT + spacing.lg,
            },
          ]}
          columnWrapperStyle={columns > 1 ? styles.row : undefined}
          renderItem={({ item, index }) => (
            <FavouriteGridItem
              item={item}
              index={index}
              width={cardWidth}
            />
          )}
          getItemLayout={(_, index) => {
            const row = Math.floor(index / columns)
            return {
              length: ITEM_HEIGHT,
              offset: row * (ITEM_HEIGHT + GAP),
              index,
            }
          }}
        />
      )}
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  row: {
    gap: GAP,
    marginBottom: GAP,
  },
})
