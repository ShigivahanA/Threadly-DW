import { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'

import wardrobeService from '@/src/services/wardrobeService'
import WardrobeHeader from '@/src/components/wardrobe/WardrobeHeader'
import WardrobeFilters from '@/src/components/wardrobe/WardrobeFilters'
import WardrobeCard from '@/src/components/wardrobe/WardrobeCard'
import WardrobeSkeleton from '@/src/components/wardrobe/WardrobeSkeleton'
import EmptyState from '@/src/components/wardrobe/EmptyState'
import { spacing } from '@/src/theme/spacing'

const SCREEN_WIDTH = Dimensions.get('window').width
const GAP = spacing.md
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - GAP) / 2

export default function WardrobeScreen() {
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
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id: string) => {
    const res = await wardrobeService.toggleFavorite(id)
    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, isFavorite: res.isFavorite } : i
      )
    )
  }

  useEffect(() => {
    loadItems()
  }, [category])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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

        {items.length > 0 && (
          <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
            <FlatList
              data={items}
              keyExtractor={(item) => item._id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <WardrobeCard
                  item={item}
                  width={CARD_WIDTH}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    flex: 1,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
})
