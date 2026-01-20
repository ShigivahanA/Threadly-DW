import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { spacing } from '@/src/theme/spacing'

export default function WardrobeCard({
  item,
  width,
  onToggleFavorite,
}: {
  item: any
  width: number
  onToggleFavorite: (id: string) => void
}) {
  return (
    <Pressable style={[styles.card, { width }]}>
      {/* Favorite */}
      <Pressable
        onPress={() => onToggleFavorite(item._id)}
        style={styles.favorite}
      >
        <Ionicons
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={16}
          color={item.isFavorite ? '#ef4444' : '#666'}
        />
      </Pressable>

      {/* Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      {/* Meta */}
      <View style={styles.meta}>
        <View style={styles.row}>
          <Text style={styles.category}>{item.category}</Text>
          {item.size && <Text style={styles.size}>{item.size}</Text>}
        </View>

        {item.colors?.length > 0 && (
          <View style={styles.colors}>
            {item.colors.slice(0, 4).map((c: string) => (
              <View
                key={c}
                style={[styles.dot, { backgroundColor: c }]}
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
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  favorite: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    padding: 6,
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
    color: '#666',
  },
  size: {
    fontSize: 11,
    color: '#999',
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
    borderColor: '#00000020',
  },
})
