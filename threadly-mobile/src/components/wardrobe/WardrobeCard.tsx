import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function WardrobeCard({
  item,
  width,
  onToggleFavorite,
}: {
  item: any
  width: number
  onToggleFavorite: (id: string) => void
}) {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <Pressable
      onPress={() =>
        router.push(`/(tabs)/wardrobe/${item._id}`)
      }
      style={[
        styles.card,
        {
          width,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* ❤️ Favorite (isolated press) */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation() // 👈 CRITICAL
          onToggleFavorite(item._id)
        }}
        style={[
          styles.favorite,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={16}
          color={
            item.isFavorite
              ? colors.danger
              : colors.textSecondary
          }
        />
      </Pressable>

      {/* Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      {/* Meta */}
      <View style={styles.meta}>
        <View style={styles.row}>
          <Text
            style={[
              styles.category,
              { color: colors.textSecondary },
            ]}
          >
            {item.category}
          </Text>

          {item.size && (
            <Text
              style={[
                styles.size,
                { color: colors.textSecondary },
              ]}
            >
              {item.size}
            </Text>
          )}
        </View>

        {item.colors?.length > 0 && (
          <View style={styles.colors}>
            {item.colors.slice(0, 4).map((c: string) => (
              <View
                key={c}
                style={[
                  styles.dot,
                  {
                    backgroundColor: c,
                    borderColor: colors.border,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Pressable>
  )
}


const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },

  favorite: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
  },

  image: {
    width: '100%',
    aspectRatio: 1,
  },

  meta: {
    padding: spacing.sm,
    gap: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  category: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  size: {
    fontSize: 11,
  },

  colors: {
    flexDirection: 'row',
    gap: 6,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
})
