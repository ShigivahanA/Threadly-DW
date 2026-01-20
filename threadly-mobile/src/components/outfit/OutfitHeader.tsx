import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props = {
  count: number
  loading?: boolean
}

export default function OutfitHeader({ count, loading }: Props) {
  const router = useRouter()
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Saved Outfits
        </Text>
      </View>

      {/* Sub */}
      <Text
        style={[
          styles.sub,
          {
            color: colors.textSecondary,
            opacity: scheme === 'dark' ? 0.85 : 0.7,
          },
        ]}
      >
        {loading ? '—' : count} outfit{count !== 1 ? 's' : ''}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  sub: {
    fontSize: 13,
    marginLeft: 36 + spacing.sm, // aligns under title (not back button)
  },
})
