import { View, Text, StyleSheet, Pressable, Platform } from 'react-native'
import { useTheme } from '@/src/theme/ThemeProvider'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { normalize } from '@/src/utils/responsive'

import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props = {
  count: number
  loading?: boolean
}

const MONO = Platform.OS === 'ios' ? 'Courier' : 'monospace'

export default function FavouriteHeader({ count, loading }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Top Row: Back + Status */}
      <View style={styles.topRow}>
        <Pressable
          onPress={goBack}
          hitSlop={15}
          style={[styles.backBtn, { borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.statusBox}>
          <View style={[styles.dot, { backgroundColor: '#ff4d4f' }]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>SECURE_VAULT</Text>
        </View>
      </View>

      {/* Main Content */}
      <Animated.Text
        entering={FadeInDown.duration(600)}
        style={[styles.title, { color: colors.textPrimary }]}
      >
        FAVOURITES
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(100).duration(600)}
        style={[styles.sub, { color: colors.textSecondary }]}
      >
        // {loading ? 'SYNCING_ARCHIVE...' : `DISPLAYING_${count}_CURATED_RECORDS`}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 79, 0.2)',
    backgroundColor: 'rgba(255, 77, 79, 0.05)',
  },
  statusText: {
    fontSize: normalize(8),
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  sub: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '700',
    marginTop: 4,
  },
})
