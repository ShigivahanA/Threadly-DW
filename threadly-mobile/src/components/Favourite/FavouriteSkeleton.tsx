// FavouriteSkeleton.tsx
import { View, StyleSheet, FlatList } from 'react-native'
import { spacing } from '@/src/theme/spacing'

type Props = {
  columns: number
}

export default function FavouriteSkeleton({ columns }: Props) {
  return (
    <FlatList
      data={Array.from({ length: columns * 3 })}
      keyExtractor={(_, i) => `skeleton-${i}`}
      numColumns={columns}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      renderItem={() => <View style={styles.card} />}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
})
