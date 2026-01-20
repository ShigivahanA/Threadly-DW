import { View, StyleSheet, Dimensions } from 'react-native'
import { spacing } from '@/src/theme/spacing'

const SCREEN_WIDTH = Dimensions.get('window').width
const GAP = spacing.md
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - GAP) / 2

export default function WardrobeSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} style={[styles.card, { width: CARD_WIDTH }]}>
          {/* Image */}
          <View style={styles.image} />

          {/* Meta */}
          <View style={styles.meta}>
            <View style={styles.lineShort} />
            <View style={styles.colors}>
              {Array.from({ length: 3 }).map((_, j) => (
                <View key={j} style={styles.dot} />
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#e5e7eb',
  },

  meta: {
    padding: spacing.sm,
    gap: 8,
  },

  lineShort: {
    height: 10,
    width: '45%',
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },

  colors: {
    flexDirection: 'row',
    gap: 6,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
})
