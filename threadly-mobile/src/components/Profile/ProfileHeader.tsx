import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props = {
  loading?: boolean
  title?: string
}

export default function ProfileHeader({
  loading,
  title = 'ACCOUNT', // Default to uppercase for consistency
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>

      {/* Animated Title */}
      <Animated.Text
        entering={FadeInDown.duration(600).delay(100)}
        style={[styles.title, { color: colors.textPrimary }]}
      >
        {title.toUpperCase()}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  back: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: normalize(28),
    fontWeight: '800',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
})
