import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import AnimatedPairingItem from '@/src/components/pairing/AnimatedPairingItem'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

import { normalize } from '@/src/utils/responsive'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// --- DIMENSIONS & CENTERING LOGIC ---
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.72) // 72% width for nice side peeks
const GAP = 16 // Explicit gap
const SPACER_WIDTH = (SCREEN_WIDTH - CARD_WIDTH) / 2

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

type Props = {
  title: string
  items: any[]
  onChange: (item: any) => void
}

export default function PairingRow({ title, items, onChange }: Props) {
  const listRef = useRef<FlatList>(null)
  const scrollX = useSharedValue(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  // Initial Selection
  useEffect(() => {
    if (items.length) onChange(items[0])
  }, [items])

  if (!items.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{title.toUpperCase()}</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
             // NO ITEMS
        </Text>
      </View>
    )
  }

  const handleMomentumEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP))
    if (index !== currentIndex && items[index]) {
      /* Haptics.selectionAsync() */ // Remove haptic loop if caused by scroll updates
      // trigger only on confirmed change
      setCurrentIndex(index)
      onChange(items[index])
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {title.toUpperCase()}
      </Text>

      <AnimatedFlatList
        ref={listRef}
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}

        // Snapping Logic
        snapToInterval={CARD_WIDTH + GAP}
        decelerationRate="fast"
        disableIntervalMomentum

        onScroll={onScroll}
        scrollEventThrottle={16}

        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + GAP,
          offset: (CARD_WIDTH + GAP) * index,
          index,
        })}
        onMomentumScrollEnd={handleMomentumEnd}

        // Spacers for Centering
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        ListHeaderComponent={<View style={{ width: SPACER_WIDTH }} />}
        ListFooterComponent={<View style={{ width: SPACER_WIDTH }} />}

        renderItem={({ item, index }) => (
          <AnimatedPairingItem
            item={item}
            index={index}
            cardWidth={CARD_WIDTH}
            gap={GAP}
            scrollX={scrollX}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 44, // Increased from 24 to add space
  },
  label: {
    textAlign: 'center',
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    fontSize: normalize(11),
    fontFamily: 'Courier',
    opacity: 0.5,
  },
})
