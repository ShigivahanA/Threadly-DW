import { useEffect, useState, useMemo } from 'react'
import { StyleSheet, FlatList, Dimensions, View } from 'react-native'
import { useSafeAreaInsets  } from 'react-native-safe-area-context'

import wardrobeService from '@/src/services/wardrobeService'
import FavouriteHeader from '@/src/components/Favourite/FavouriteHeader'
import FavouriteSkeleton from '@/src/components/Favourite/FavouriteSkeleton'
import FavouriteEmpty from '@/src/components/Favourite/FavouriteEmpty'
import FavouriteGridItem from '@/src/components/Favourite/FavouriteGridItem'
import { spacing } from '@/src/theme/spacing'

const GAP = spacing.lg

const getColumns = (width: number) => {
  if (width >= 900) return 3 // tablets
  return 2 // phones
}

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const TAB_BAR_HEIGHT = 64
  const screenWidth = Dimensions.get('window').width
  const columns = getColumns(screenWidth)

  const cardWidth = useMemo(() => {
    return (
      (screenWidth -
        spacing.xl * 2 -
        GAP * (columns - 1)) /
      columns
    )
  }, [screenWidth, columns])

  const ITEM_HEIGHT = cardWidth

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await wardrobeService.getItems('?favorite=true')
        if (mounted) setItems(res?.items ?? [])
      } catch {
        if (mounted) setItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
  <>
    {/* Header */}
    <View
  style={[
    styles.header,
    { paddingTop: insets.top + spacing.sm },
  ]}
>
      <FavouriteHeader count={items.length} loading={loading} />
    </View>

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
  </>
)
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
