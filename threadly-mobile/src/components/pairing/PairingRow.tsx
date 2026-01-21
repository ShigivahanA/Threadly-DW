import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import { useEffect, useRef } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import AnimatedPairingItem from '@/src/components/pairing/AnimatedPairingItem'
import { spacing } from '@/src/theme/spacing'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const H_PADDING = spacing.xl * 2
const CONTENT_WIDTH = SCREEN_WIDTH - H_PADDING
const CARD_WIDTH = Math.round(CONTENT_WIDTH * 0.92)
const GAP = spacing.md

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

type Props = {
  title: string
  items: any[]
  onChange: (item: any) => void
}

export default function PairingRow({ title, items, onChange }: Props) {
  const listRef = useRef<FlatList>(null)
  const scrollX = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  useEffect(() => {
    if (items.length) onChange(items[0])
  }, [items])

  if (!items.length) {
    return (
      <Text style={styles.empty}>
        No {title.toLowerCase()} items
      </Text>
    )
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{title}</Text>

      <AnimatedFlatList
        ref={listRef}
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + GAP}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + GAP,
          offset: (CARD_WIDTH + GAP) * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP)
          )
          onChange(items[index])
        }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        ListHeaderComponent={
          <View style={{ width: (CONTENT_WIDTH - CARD_WIDTH) / 2 }} />
        }
        ListFooterComponent={
          <View style={{ width: (CONTENT_WIDTH - CARD_WIDTH) / 2 }} />
        }
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
    marginBottom: spacing.xl,
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
    opacity: 0.6,
  },
  empty: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: spacing.lg,
  },
})
