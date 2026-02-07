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
import { normalize } from '@/src/utils/responsive'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

import outfitService from '@/src/services/outfitService'
import OutfitDetailSkeleton from '@/src/components/outfit/OutfitDetailSkeleton'
import OutfitItemCard from '@/src/components/outfit/OutfitItemCard'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import PrimaryButton from '@/src/components/auth/PrimaryButton'

const TAB_BAR_HEIGHT = 64
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.6 // Consistent Blueprint Scale

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const toast = useToast()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [outfit, setOutfit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!id) return
    outfitService.getOutfitById(id)
      .then((res) => {
        if (!res) throw new Error('No outfit')
        setOutfit(res)
      })
      .catch(() => {
        toast.show('Outfit record lost', 'error')
        router.back()
      })
      .finally(() => setLoading(false))
  }, [id])


  const markWorn = async () => {
    setUpdating(true)
    try {
      await outfitService.markWorn(id)
      setOutfit((prev: any) => ({
        ...prev,
        wearCount: (prev.wearCount || 0) + 1,
        lastWornAt: new Date().toISOString(),
      }))
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Wear count incremented', 'success')
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show('Failed to log wear', 'error')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <OutfitDetailSkeleton />
  if (!outfit) return null

  // Ensure items exist
  const top = outfit.items?.top
  const bottom = outfit.items?.bottom
  const shoe = outfit.items?.footwear

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + TAB_BAR_HEIGHT + spacing.xl,
      }}
    >
      {/* --- Header --- */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>ARCHIVE</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>// {id?.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={{ width: 24 }} />
      </Animated.View>

      {/* --- Blueprint View --- */}
      <View style={styles.stage}>
        {/* The Thread Line */}
        <View style={[styles.threadLine, { borderColor: colors.border }]} />

        {/* Items Staggered */}
        {top && (
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.itemWrapper, { alignSelf: 'flex-start', marginLeft: spacing.lg }]}>
            <OutfitItemCard item={top} width={CARD_WIDTH} />
            <View style={[styles.connector, { right: -20, borderColor: colors.border }]} />
          </Animated.View>
        )}

        {bottom && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.itemWrapper, { alignSelf: 'flex-end', marginRight: spacing.lg, marginTop: -40 }]}>
            <OutfitItemCard item={bottom} width={CARD_WIDTH} />
            <View style={[styles.connector, { left: -20, borderColor: colors.border }]} />
          </Animated.View>
        )}

        {shoe && (
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.itemWrapper, { alignSelf: 'center', marginTop: -40 }]}>
            <OutfitItemCard item={shoe} width={CARD_WIDTH} />
          </Animated.View>
        )}
      </View>

      {/* --- Metadata Specs --- */}
      <BlurView
        intensity={theme === 'dark' ? 50 : 80}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.specs, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
      >
        <View style={styles.specRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>OCCASION</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{outfit.occasion || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>WEAR_COUNT</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{outfit.wearCount}</Text>
        </View>
        {outfit.lastWornAt && (
          <View style={styles.specRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>LAST_WORN</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{new Date(outfit.lastWornAt).toLocaleDateString()}</Text>
          </View>
        )}
        {outfit.notes ? (
          <View style={styles.specRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>NOTES</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{outfit.notes}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            title={updating ? "LOGGING..." : "LOG WEAR"}
            onPress={markWorn}
            loading={updating}
          />
        </View>
      </BlurView>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: normalize(22),
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: normalize(10),
    fontFamily: 'Courier',
    opacity: 0.6,
  },
  stage: {
    position: 'relative',
    marginBottom: 40,
    minHeight: 400,
  },
  threadLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  itemWrapper: {
    marginBottom: 0,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  connector: {
    position: 'absolute',
    top: '50%',
    width: 20,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  specs: {
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    gap: 16,
  },
  specRow: {
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
    paddingBottom: 12,
  },
  label: {
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 1,
  },
  value: {
    fontSize: normalize(14),
    fontFamily: 'Courier',
    fontWeight: '500',
  }
})
