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
    const distance = scrollX.value - centerOffset // Signed distance for rotation direction
    const absDistance = Math.abs(distance)

    const scale = interpolate(
      absDistance,
      [0, cardWidth + gap],
      [1, 0.85],
      Extrapolate.CLAMP
    )

    const opacity = interpolate(
      absDistance,
      [0, cardWidth + gap],
      [1, 0.4],
      Extrapolate.CLAMP
    )

    // Fan Effect: Rotate items away from center
    const rotate = interpolate(
      distance,
      [-cardWidth - gap, 0, cardWidth + gap],
      [-5, 0, 5],
      Extrapolate.CLAMP
    )

    return {
      transform: [
        { scale },
        { rotate: `${rotate}deg` }
      ],
      opacity,
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <PairingCard item={item} width={cardWidth} />
    </Animated.View>
  )
}
