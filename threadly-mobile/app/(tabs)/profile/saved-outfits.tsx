import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'

import outfitService from '@/src/services/outfitService'
import OutfitHeader from '@/src/components/outfit/OutfitHeader'
import OutfitFolderCard from '@/src/components/outfit/OutfitFolderCard'
import OutfitFolderSkeleton from '@/src/components/outfit/OutfitFolderSkeleton'
import OutfitEmpty from '@/src/components/outfit/OutfitEmpty'
import { spacing } from '@/src/theme/spacing'

const TAB_BAR_HEIGHT = 64

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
    <>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm },
        ]}
      >
        <OutfitHeader count={outfits.length} loading={loading} />
      </View>

      {/* Content */}
      {loading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          scrollEnabled={false}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                insets.bottom + TAB_BAR_HEIGHT + spacing.lg,
            },
          ]}
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
            contentContainerStyle={[
              styles.list,
              {
                paddingBottom:
                  insets.bottom + TAB_BAR_HEIGHT + spacing.lg,
              },
            ]}
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
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },

  list: {
    paddingHorizontal: spacing.xl,
  },

  item: {
    marginBottom: spacing.lg,
  },
})
