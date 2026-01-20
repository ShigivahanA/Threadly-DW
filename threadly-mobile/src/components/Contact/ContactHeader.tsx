import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useTheme } from '@/src/theme/ThemeProvider'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

export default function ContactHeader() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Contact
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  back: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    marginLeft: 26,
  },
})
