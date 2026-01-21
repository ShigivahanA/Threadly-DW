import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'
import wardrobeService from '@/src/services/wardrobeService'
import PairingRow from '@/src/components/pairing/PairingRow'
import PairingSkeleton from '@/src/components/pairing/PairingSkeleton'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { router } from 'expo-router'

const TOPS = ['shirt', 'tshirt', 'jacket']
const BOTTOMS = ['pant', 'jeans']
const FOOTWEAR = ['shoes']
const TAB_BAR_HEIGHT = 64

const normalize = (v?: string) => v?.toLowerCase().trim()

export default function PairingScreen() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()

  const [loading, setLoading] = useState(true)
  const [tops, setTops] = useState<any[]>([])
  const [bottoms, setBottoms] = useState<any[]>([])
  const [footwear, setFootwear] = useState<any[]>([])

  const [top, setTop] = useState<any>(null)
  const [bottom, setBottom] = useState<any>(null)
  const [shoe, setShoe] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await wardrobeService.getItems()
        const items = res?.items ?? []

        setTops(items.filter(i => TOPS.includes(normalize(i.category))))
        setBottoms(items.filter(i => BOTTOMS.includes(normalize(i.category))))
        setFootwear(items.filter(i => FOOTWEAR.includes(normalize(i.category))))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <PairingSkeleton />

  const canProceed = top && bottom && shoe

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + spacing.xl,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Build an Outfit
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Swipe left or right to select each item
        </Text>
      </View>

      {/* Rows */}
      <Animated.View entering={FadeIn.duration(250)}>
        <PairingRow title="Top" items={tops} onChange={setTop} />
        <PairingRow title="Bottom" items={bottoms} onChange={setBottom} />
        <PairingRow title="Footwear" items={footwear} onChange={setShoe} />
      </Animated.View>

      {/* CTA */}
      <Pressable
        disabled={!canProceed}
        onPress={() =>
  router.push({
    pathname: '/(tabs)/profile/outfit',
    params: {
      top: JSON.stringify(top),
      bottom: JSON.stringify(bottom),
      shoe: JSON.stringify(shoe),
    },
  })
}
        style={[
          styles.cta,
          {
            backgroundColor: colors.textPrimary,
            opacity: canProceed ? 1 : 0.4,
          },
        ]}
      >
        <Text style={[styles.ctaText, { color: colors.background }]}>
          View Outfit
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  cta: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontWeight: '600',
    fontSize: 15,
  },
})
