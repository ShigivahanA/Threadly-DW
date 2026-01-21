import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated'
import PairingCard from './PairingCard'

type Props = {
  item: any
  index: number
  cardWidth: number
  gap: number
  scrollX: Animated.SharedValue<number>
}

export default function AnimatedPairingItem({
  item,
  index,
  cardWidth,
  gap,
  scrollX,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const centerOffset = index * (cardWidth + gap)
    const distance = Math.abs(scrollX.value - centerOffset)

    const scale = interpolate(
      distance,
      [0, cardWidth + gap],
      [1, 0.9],
      Extrapolate.CLAMP
    )

    const opacity = interpolate(
      distance,
      [0, cardWidth + gap],
      [1, 0.5],
      Extrapolate.CLAMP
    )

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <PairingCard item={item} width={cardWidth} />
    </Animated.View>
  )
}
