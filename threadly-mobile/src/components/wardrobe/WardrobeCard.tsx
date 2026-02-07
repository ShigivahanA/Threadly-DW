import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

import { normalize } from '@/src/utils/responsive'

export default function WardrobeCard({
  item,
  width,
  onToggleFavorite,
  index = 0, // for staggered anim
}: {
  item: any
  width: number
  onToggleFavorite: (id: string) => void
  index?: number
}) {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    Haptics.selectionAsync()
    router.push(`/(tabs)/wardrobe/${item._id}`)
  }

  const handleFav = (e: any) => {
    e.stopPropagation()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onToggleFavorite(item._id)
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(500)}
      style={{ width, marginBottom: 16 }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => scale.value = withTiming(0.97, { duration: 150 })}
        onPressOut={() => scale.value = withTiming(1, { duration: 150 })}
        style={[styles.card, { backgroundColor: colors.surface }]}
      >
        <Animated.View style={[styles.inner, animatedStyle]}>
          {/* Image */}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gradient}
          />

          {/* Favorite Button */}
          <Pressable onPress={handleFav} style={styles.favBtn} hitSlop={10}>
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={item.isFavorite ? '#ff4d4f' : '#fff'}
            />
          </Pressable>

          {/* Meta Data */}
          <View style={styles.meta}>
            <Text style={styles.category}>{item.category || 'ITEM'}</Text>
            {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
          </View>

          {/* Colors (Mini Dots) */}
          {item.colors?.length > 0 && (
            <View style={styles.colors}>
              {item.colors.slice(0, 3).map((c: string, i: number) => (
                <View key={i} style={[styles.dot, { backgroundColor: c }]} />
              ))}
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    aspectRatio: 3 / 4, // Taller portrait look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inner: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  category: {
    color: '#fff',
    fontSize: normalize(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  brand: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: normalize(9),
    marginTop: 2,
  },
  colors: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
})
