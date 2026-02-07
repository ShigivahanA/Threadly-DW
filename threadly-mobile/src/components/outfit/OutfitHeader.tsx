import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/src/theme/ThemeProvider'
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

export default function OutfitHeader({ count, loading }: Props) {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Top Controls */}
      <View style={styles.topRow}>
        <Pressable
          onPress={goBack}
          hitSlop={15}
          style={[styles.back, { borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <View style={[styles.statusTag, { borderColor: colors.border }]}>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>SYNC: ACTIVE</Text>
        </View>
      </View>

      {/* Main Title */}
      <Animated.Text
        entering={FadeInDown.duration(600)}
        style={[styles.title, { color: colors.textPrimary }]}
      >
        OUTFITS
      </Animated.Text>

      {/* Sub-Technical Readout */}
      <Animated.Text
        entering={FadeInDown.delay(100).duration(600)}
        style={[styles.sub, { color: colors.textSecondary }]}
      >
        // {loading ? 'FETCHING_COMPOSITIONS...' : `${count}_RECORDED_ASSEMBLIES`}
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
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  statusText: {
    fontSize: normalize(8),
    fontFamily: MONO,
    fontWeight: '700',
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
