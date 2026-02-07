import { View, Text, StyleSheet, Pressable, ActivityIndicator, Platform } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

import { normalize } from '@/src/utils/responsive'

type Props = {
  count: number
  onRefresh?: () => void
  loading?: boolean
}

export default function WardrobeHeader({ count, onRefresh, loading }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Animated Title */}
        <Animated.Text
          entering={FadeInDown.duration(600).delay(100)}
          style={[styles.title, { color: colors.textPrimary }]}
        >
          WARDROBE
        </Animated.Text>

        {onRefresh && (
          <Pressable
            onPress={() => {
              if (loading) return
              Haptics.selectionAsync()
              onRefresh()
            }}
            hitSlop={12}
            style={({ pressed }) => [
              styles.refreshBtn,
              {
                backgroundColor: pressed ? colors.border : 'transparent',
                borderColor: colors.border,
                opacity: loading ? 0.7 : 1
              }
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Ionicons name="refresh" size={18} color={colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>

      {/* Technical Subtitle */}
      <View style={styles.subtitleRow}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            // ITEMS_COUNT: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{count}</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: normalize(42),
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Technical feel
    fontWeight: '500',
    letterSpacing: 0.5,
  },
})
