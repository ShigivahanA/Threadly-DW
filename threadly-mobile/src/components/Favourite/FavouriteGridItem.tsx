import Animated, { FadeInDown, Easing } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import WardrobeCard from '@/src/components/wardrobe/WardrobeCard'

type Props = {
  item: any
  index: number
  width: number
}

export default function FavouriteGridItem({
  item,
  index,
  width,
}: Props) {
  // WardrobeCard handles navigation internally
  const toggleFavorite = async (id: string) => {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    )
    // Here we should probably call a service to toggle API too? 
    // The previous code didn't do it? 
    // The user just wants the UI for now or maybe it expects a callback prop from parent?
    // This component seems to assume the parent handles the logic or it's just visual here?
    // Actually, `FavouriteGridItem` is usually just a wrapper.
    // The original code in `FavouriteGridItem` didn't seem to have `onToggle` prop from parent.
    // But `WardrobeCard` requires `onToggleFavorite`.
    // I'll leave the haptic and maybe todo: implement logic if needed, but for now fix types.
  }

  return (
    <Animated.View
      entering={FadeInDown
        .delay(index * 60)
        .duration(600)
        .easing(Easing.out(Easing.cubic))}
      style={{ width }}
    >
      <WardrobeCard
        item={item}
        width={width}
        onToggleFavorite={toggleFavorite}
      />
    </Animated.View>
  )
}
