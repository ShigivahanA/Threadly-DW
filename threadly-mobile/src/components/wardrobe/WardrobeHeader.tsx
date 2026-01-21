import { View, Text, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function WardrobeHeader({ count }: { count: number }) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Your Wardrobe
      </Text>

      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        {count === 0
          ? 'No pieces added yet'
          : `${count} piece${count !== 1 ? 's' : ''}`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    opacity: 0.85,
  },
})
