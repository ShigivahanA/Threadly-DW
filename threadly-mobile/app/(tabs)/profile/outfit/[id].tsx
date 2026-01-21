import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'

import outfitService from '@/src/services/outfitService'
import OutfitDetailSkeleton from '@/src/components/outfit/OutfitDetailSkeleton'
import OutfitItemCard from '@/src/components/outfit/OutfitItemCard'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

const TAB_BAR_HEIGHT = 64

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const toast = useToast()

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [outfit, setOutfit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const screenWidth = Dimensions.get('window').width

  /** ✅ Explicit width (CRITICAL for images) */
  const cardWidth = useMemo(() => {
    return screenWidth - spacing.xl * 2
  }, [screenWidth])

  useEffect(() => {
  if (!id) return

  outfitService
    .getOutfitById(id)
    .then((res) => {
      const data = res?.data   // ✅ THIS IS THE FIX

      if (!data) {
        throw new Error('No outfit')
      }

      setOutfit({
        ...data,
        items: {
          top: data?.items?.top ?? null,
          bottom: data?.items?.bottom ?? null,
          footwear: data?.items?.footwear ?? null,
        },
      })
    })
    .catch(() => {
      toast.show('Outfit not found', 'error')
      router.back()
    })
    .finally(() => setLoading(false))
}, [id])

  if (loading) return <OutfitDetailSkeleton />

  if (!outfit) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textSecondary }}>
          Outfit not found
        </Text>
      </View>
    )
  }

  const items = [
    outfit.items?.top,
    outfit.items?.bottom,
    outfit.items?.footwear,
  ].filter(Boolean)

  const markWorn = async () => {
  setUpdating(true)

  try {
    await outfitService.markWorn(id)

    setOutfit((prev: any) => {
      const nextWearCount =
        typeof prev.wearCount === 'number'
          ? prev.wearCount + 1
          : 1

      const now = new Date().toISOString()

      return {
        ...prev,
        wearCount: nextWearCount,
        lastWornAt: now,
      }
    })

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    toast.show('Marked as worn today', 'success')
  } catch {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    toast.show('Failed to update outfit', 'error')
  } finally {
    setUpdating(false)
  }
}

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
          paddingBottom:
            insets.bottom + TAB_BAR_HEIGHT + spacing.xl,
        },
      ]}
    >
      {/* 🔙 Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          Outfit Details
        </Text>
      </View>

      {/* 🧥 Outfit items */}
      <View style={styles.items}>
        {items.map((item: any) => (
          <OutfitItemCard
            key={item._id}
            item={item}
            width={cardWidth}  
          />
        ))}
      </View>

      {/* 📊 Stats */}
      <View style={styles.stats}>
        <Text
          style={[
            styles.statText,
            { color: colors.textSecondary },
          ]}
        >
          Worn {outfit.wearCount} time
          {outfit.wearCount !== 1 ? 's' : ''}
        </Text>

        {outfit.lastWornAt && (
          <Text
            style={[
              styles.subText,
              { color: colors.textSecondary },
            ]}
          >
            Last worn on{' '}
            {new Date(
              outfit.lastWornAt
            ).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* ✅ Action */}
      <Pressable
  disabled={updating}
  onPress={markWorn}
  style={[
    styles.primaryButton,
    {
      backgroundColor: colors.primary,
      opacity: updating ? 0.6 : 1,
    },
  ]}
>
  {updating ? (
    <ActivityIndicator  />
  ) : (
    <Text
      style={[
        styles.primaryButtonText,
        { color: colors.onPrimary },
      ]}
    >
      Mark as worn today
    </Text>
  )}
</Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },

  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  items: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  stats: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },

  statText: {
    fontSize: 14,
  },

  subText: {
    fontSize: 12,
    opacity: 0.8,
  },

  primaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
