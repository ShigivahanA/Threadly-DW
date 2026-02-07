import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import wardrobeService from '@/src/services/wardrobeService'
import PairingRow from '@/src/components/pairing/PairingRow'
import PairingSkeleton from '@/src/components/pairing/PairingSkeleton'
import PrimaryButton from '@/src/components/auth/PrimaryButton'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { router } from 'expo-router'

import { normalize } from '@/src/utils/responsive'

const TOPS = [
  'tshirt',
  'shirt',
  'top',
  'blouse',
  'tank_top',
  'sweater',
  'hoodie',
  'jacket',
  'coat',
  'blazer',
  'kurta'
]

const BOTTOMS = [
  'pant',
  'jeans',
  'trousers',
  'shorts',
  'skirt',
  'leggings',
  'joggers',
  'salwar',
  'dhoti'
]

const FOOTWEAR = [
  'shoes',
  'sneakers',
  'sandals',
  'heels',
  'flats',
  'boots'
]

const ACCESSORIES = [
  'cap',
  'hat',
  'scarf',
  'belt',
  'socks'
]

const ONE_PIECE = [
  'dress',
  'jumpsuit',
  'romper',
  'overalls',
  'saree',
  'lehenga',
  'school_uniform',
  'onesie'
]

const TAB_BAR_HEIGHT = 64

const normStr = (v?: string) => v?.toLowerCase().trim()

export default function PairingScreen() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tops, setTops] = useState<any[]>([])
  const [bottoms, setBottoms] = useState<any[]>([])
  const [footwear, setFootwear] = useState<any[]>([])
  const [accessories, setAccessories] = useState<any[]>([])

  const [top, setTop] = useState<any>(null)
  const [bottom, setBottom] = useState<any>(null)
  const [shoe, setShoe] = useState<any>(null)
  const [accessory, setAccessory] = useState<any>(null)

  const loadData = useCallback(async (isRef = false) => {
    try {
      if (isRef) setRefreshing(true)

      const res = await wardrobeService.getItems()
      const items = res?.items ?? []
      // Simple categorization for demo
      setTops(items.filter((i: any) => TOPS.some(t => normStr(i.category)?.includes(t))))
      setBottoms(items.filter((i: any) => BOTTOMS.some(b => normStr(i.category)?.includes(b))))
      setFootwear(items.filter((i: any) => FOOTWEAR.some(f => normStr(i.category)?.includes(f))))
      setAccessories(items.filter((i: any) => ACCESSORIES.some(a => normStr(i.category)?.includes(a))))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleManualRefresh = () => {
    toast.show('Syncing Outfit OS...', 'info')
    loadData(false)
  }

  const onRefresh = () => {
    loadData(true)
  }

  if (loading) return <PairingSkeleton />

  const canProceed = top && bottom && shoe

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
            title="// SYNCING_OUTFIT_OS..."
            titleColor={colors.textSecondary}
            progressBackgroundColor={colors.surface}
            colors={[colors.textPrimary]}
          />
        }
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 100
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 24 }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                STUDIO
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    // CURATE_OUTFIT_OS
              </Text>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync()
                handleManualRefresh()
              }}
              hitSlop={12}
              style={({ pressed }) => [
                styles.refreshBtn,
                {
                  backgroundColor: pressed ? colors.border : 'transparent',
                  borderColor: colors.border
                }
              ]}
            >
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Rows */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.rows}>
          <PairingRow title="Select Top" items={tops} onChange={setTop} />
          <PairingRow title="Select Bottom" items={bottoms} onChange={setBottom} />
          <PairingRow title="Select Footwear" items={footwear} onChange={setShoe} />
          {accessories.length > 0 && (
            <PairingRow title="Select Accessory" items={accessories} onChange={setAccessory} />
          )}
        </Animated.View>
      </ScrollView>

      {/* Floating Footer */}
      <BlurView
        intensity={theme === 'dark' ? 80 : 95}
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16,
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
          }
        ]}
      >
        <PrimaryButton
          title="GENERATE LOOK"
          disabled={!canProceed}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/profile/outfit',
              params: {
                top: JSON.stringify(top),
                bottom: JSON.stringify(bottom),
                shoe: JSON.stringify(shoe),
                accessory: accessory ? JSON.stringify(accessory) : undefined,
              },
            })
          }
        />
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: normalize(34),
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: normalize(10),
    fontFamily: 'Courier',
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.7,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  rows: {
    gap: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  }
})
