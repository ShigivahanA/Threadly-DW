// src/components/outfit/OutfitDetailSkeleton.tsx
import { View, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'

export default function OutfitDetailSkeleton() {
  return (
    <View style={styles.wrap}>
      <View style={styles.title} />

      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card} />
      ))}

      <View style={styles.stat} />
      <View style={styles.subStat} />

      <View style={styles.button} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.xl,
    gap: spacing.lg,
  },

  title: {
    height: 22,
    width: 140,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },

  card: {
    aspectRatio: 4 / 5,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },

  stat: {
    height: 14,
    width: 120,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },

  subStat: {
    height: 12,
    width: 160,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
  },
})
