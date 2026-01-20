import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

export default function StorageScreen() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()

  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <View style={styles.center}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="construct-outline"
            size={28}
            color={colors.textPrimary}
          />
        </View>

        <Text
          style={[styles.title, { color: colors.textPrimary }]}
        >
          Storage
        </Text>

        <Text
          style={[styles.text, { color: colors.textSecondary }]}
        >
          Storage insights and controls are currently under
          construction. This section will help you understand how
          your data is stored and managed.
        </Text>

        {/* Action */}
        <Pressable
          onPress={goBack}
          hitSlop={8}
          style={[
            styles.button,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textPrimary },
            ]}
          >
            Go back
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },

  button: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
