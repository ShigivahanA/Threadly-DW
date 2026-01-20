import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'

import outfitService from '@/src/services/outfitService'
import OutfitHeader from '@/src/components/outfit/OutfitHeader'
import OutfitFolderCard from '@/src/components/outfit/OutfitFolderCard'
import OutfitFolderSkeleton from '@/src/components/outfit/OutfitFolderSkeleton'
import OutfitEmpty from '@/src/components/outfit/OutfitEmpty'
import { spacing } from '@/src/theme/spacing'

export default function SavedOutfitsScreen() {
  const insets = useSafeAreaInsets()
  const [outfits, setOutfits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    outfitService
      .getOutfits()
      .then((res) => {
        if (mounted) setOutfits(res?.data ?? [])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <OutfitHeader count={outfits.length} loading={loading} />
      </View>

      {/* Content */}
      {loading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={() => (
            <View style={styles.item}>
              <OutfitFolderSkeleton width="100%" />
            </View>
          )}
        />
      ) : outfits.length === 0 ? (
        <OutfitEmpty />
      ) : (
        <Animated.View entering={FadeIn.duration(250)} style={{ flex: 1 }}>
          <FlatList
            data={outfits}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <OutfitFolderCard
                  outfit={item}
                  index={index}
                  width="100%"
                />
              </View>
            )}
          />
        </Animated.View>
      )}
    </SafeAreaView>
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

  item: {
    marginBottom: spacing.lg,
  },
})
