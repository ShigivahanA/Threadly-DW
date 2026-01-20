import Animated, { FadeIn } from 'react-native-reanimated'
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
  const router = useRouter()

  const openItem = async () => {
    await Haptics.selectionAsync()
    router.push({
      pathname: '/wardrobe/[id]',
      params: { id: item._id },
    })
  }

  const toggleFavorite = async () => {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    )
  }

  return (
    <Animated.View
      entering={FadeIn
        .delay(index * 40)
        .duration(220)}
      style={{ width }}
    >
      <WardrobeCard
        item={item}
        onOpen={openItem}
        onToggleFavorite={toggleFavorite}
      />
    </Animated.View>
  )
}
