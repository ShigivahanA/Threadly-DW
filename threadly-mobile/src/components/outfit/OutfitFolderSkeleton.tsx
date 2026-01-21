import { View, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'

type Props = {
  width?: number
}

export default function OutfitFolderSkeleton({ width }: Props) {
  return (
    <View style={[styles.card, { width }]}>
      {/* Image grid */}
      <View style={styles.grid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.imageWrap}>
            <View style={styles.image} />
          </View>
        ))}
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <View style={styles.lineWide} />
        <View style={styles.lineNarrow} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    opacity: 0.55,
  },

  grid: {
    flexDirection: 'row',
    gap: 2,
    padding: 2,
  },

  imageWrap: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#d1d5db',
  },

  image: {
    flex: 1,
    backgroundColor: '#d1d5db',
  },

  meta: {
    padding: spacing.sm,
    gap: 6,
  },

  lineWide: {
    height: 11,
    width: '70%',
    backgroundColor: '#d1d5db',
    borderRadius: 6,
  },

  lineNarrow: {
    height: 11,
    width: '45%',
    backgroundColor: '#d1d5db',
    borderRadius: 6,
  },
})
