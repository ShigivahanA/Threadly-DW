import { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useToast } from '@/src/components/Toast/ToastProvider'
import wardrobeService from '@/src/services/wardrobeService'
import WardrobeHeader from '@/src/components/wardrobe/WardrobeHeader'
import WardrobeFilters from '@/src/components/wardrobe/WardrobeFilters'
import WardrobeCard from '@/src/components/wardrobe/WardrobeCard'
import WardrobeSkeleton from '@/src/components/wardrobe/WardrobeSkeleton'
import EmptyState from '@/src/components/wardrobe/EmptyState'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

const SCREEN_WIDTH = Dimensions.get('window').width
const GAP = spacing.md
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - GAP) / 2
const TAB_BAR_HEIGHT = 64 // match your tab bar height

export default function WardrobeScreen() {
  const { theme } = useTheme()
  const toast = useToast()
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)

  const loadItems = async () => {
    try {
      setLoading(true)
      const query = category ? `?category=${category}` : ''
      const data = await wardrobeService.getItems(query)
      setItems(data?.items ?? [])
    } catch {
      toast.show('Failed to load wardrobe', 'error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

const toggleFavorite = async (id: string) => {
  try {
    const res = await wardrobeService.toggleFavorite(id)

    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, isFavorite: res.isFavorite } : i
      )
    )

    toast.show(
      res.isFavorite ? 'Added to favourites' : 'Removed from favourites',
      'success'
    )
  } catch {
    toast.show('Could not update favourite', 'error')
  }
}


useEffect(() => {
  if (category) {
    toast.show(`Filtering by ${category}`, 'info')
  }
  loadItems()
}, [category])


  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[
        styles.list,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom:
            insets.bottom + TAB_BAR_HEIGHT + spacing.lg,
          backgroundColor: colors.background,
        },
      ]}
      ListHeaderComponent={
        <View style={styles.header}>
          <WardrobeHeader count={items.length} />

          <WardrobeFilters
            value={category}
            onChange={setCategory}
            onReset={() => setCategory(null)}
          />

          {loading && items.length === 0 && <WardrobeSkeleton />}

          {!loading && items.length === 0 && (
            <EmptyState onReset={() => setCategory(null)} />
          )}
        </View>
      }
      renderItem={({ item }) => (
        <Animated.View entering={FadeIn.duration(200)}>
          <WardrobeCard
            item={item}
            width={CARD_WIDTH}
            onToggleFavorite={toggleFavorite}
          />
        </Animated.View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.xl,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
})
