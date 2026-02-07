import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props = {
  outfit: any
  index: number
  width?: number | string
}

export default function OutfitFolderCard({
  outfit,
  index,
  width = '48%',
}: Props) {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const isDark = theme === 'dark'

  const items = outfit.items || {}
  // Priority: Top -> Outwear -> Dress -> Bottom -> Footwear
  const priorityList = [items.top, items.dress, items.outerwear, items.bottom, items.footwear]
  const validItems = priorityList.filter(Boolean)

  const heroItem = validItems[0]
  const stackItems = validItems.slice(1, 4) // Next 3 items

  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = async () => {
    await Haptics.selectionAsync()
    router.push({
      pathname: '/(tabs)/profile/outfit/[id]',
      params: { id: outfit._id },
    })
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={{ width: width as any, marginBottom: 20 }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => scale.value = withTiming(0.96, { duration: 150 })}
        onPressOut={() => scale.value = withTiming(1, { duration: 150 })}
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            shadowColor: isDark ? '#000' : '#888',
            elevation: 6,
          }
        ]}
      >
        <Animated.View style={[styles.inner, animatedStyle]}>
          {/* --- HERO IMAGE (Full Bleed) --- */}
          {heroItem ? (
            <Image
              source={{ uri: heroItem.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: isDark ? '#1f2937' : '#e5e7eb' }]}>
              <Ionicons name="shirt-outline" size={40} color={colors.textSecondary} />
            </View>
          )}

          {/* --- TOP RIGHT STACK --- */}
          {stackItems.length > 0 && (
            <View style={styles.stackContainer}>
              {stackItems.map((item: any, i) => (
                <View
                  key={item._id}
                  style={[
                    styles.stackRing,
                    {
                      borderColor: colors.surface,
                      zIndex: 10 - i,
                      marginRight: -10
                    }
                  ]}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.stackImage} />
                </View>
              ))}
              {validItems.length > 4 && (
                <View style={[styles.stackRing, { backgroundColor: colors.surface, zIndex: 0 }]}>
                  <Text style={[styles.moreText, { color: colors.textPrimary }]}>+{validItems.length - 4}</Text>
                </View>
              )}
            </View>
          )}

          {/* --- GLASS ISLAND INFO --- */}
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.glassIsland}
          >
            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={[styles.title, { color: colors.textPrimary }]}>
                {outfit.occasion || 'Untitled'}
              </Text>
              {/* Status Dot */}
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            </View>

            <View style={styles.subRow}>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {validItems.length} items
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                • {outfit.wearCount} worn
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  inner: {
    height: 250, // Fixed tall height
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(120,120,120,0.1)', // Placeholder bg
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stack
  stackContainer: {
    position: 'absolute',
    top: 12,
    right: 20, // Give space for right spacing
    flexDirection: 'row',
  },
  stackRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  stackImage: {
    width: '100%',
    height: '100%',
  },
  moreText: {
    fontSize: 9,
    fontWeight: '800',
  },

  // Glass Island
  glassIsland: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden', // wrapper for blur
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
})
