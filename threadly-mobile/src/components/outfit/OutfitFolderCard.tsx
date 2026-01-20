import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'react-native'
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props = {
  outfit: any
  index: number
  width?: number
}

export default function OutfitFolderCard({
  outfit,
  index,
  width = '48%',
}: Props) {
  const router = useRouter()
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  const { top, bottom, footwear } = outfit.items

  /* Press scale (active:scale-[0.98]) */
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = async () => {
    await Haptics.selectionAsync()
    router.push({
      pathname: '/outfits/[id]',
      params: { id: outfit._id },
    })
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).duration(360)}
      style={[{ width }, animatedStyle]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 18 })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18 })
        }}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Preview */}
        <View style={styles.preview}>
          {[top, bottom, footwear].map((item: any) => (
            <Image
              key={item._id}
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
              style={styles.previewImage}
            />
          ))}
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <Text
            numberOfLines={1}
            style={[styles.occasion, { color: colors.textSecondary }]}
          >
            {outfit.occasion || 'No occasion'}
          </Text>

          <Text style={[styles.wear, { color: colors.textMuted }]}>
            Worn {outfit.wearCount} time
            {outfit.wearCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.sm,

    // iOS shadow (hover:shadow-lg analogue)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 3,
  },

  preview: {
    flexDirection: 'row',
    gap: 4,
    borderRadius: 14,
    overflow: 'hidden',
  },

  previewImage: {
    flex: 1,
    aspectRatio: 1,
  },

  meta: {
    marginTop: spacing.sm,
    gap: 2,
  },

  occasion: {
    fontSize: 12,
    fontWeight: '500',
  },

  wear: {
    fontSize: 11,
    opacity: 0.7,
  },
})
