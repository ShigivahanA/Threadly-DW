import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { spacing } from '@/src/theme/spacing'

const TAB_BAR_HEIGHT = 64

export default function PairingSkeleton() {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + spacing.xl,
        },
      ]}
    >
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={styles.title} />
        <View style={styles.subtitle} />
      </View>

      {/* Card rows */}
      <View style={styles.rows}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.row} />
        ))}
      </View>

      {/* CTA skeleton */}
      <View style={styles.cta} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'transparent',
  },

  /* Header */
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  title: {
    width: 140,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  subtitle: {
    width: 220,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    opacity: 0.7,
  },

  /* Rows */
  rows: {
    gap: spacing.xl,
  },
  row: {
    height: 260, // matches real card row height
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },

  /* CTA */
  cta: {
    marginTop: spacing.xl,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
})
