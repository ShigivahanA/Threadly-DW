import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { useToast } from '@/src/components/Toast/ToastProvider'

const TAB_BAR_HEIGHT = 64

export default function EmptyState({
  onReset,
}: {
  onReset?: () => void
}) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const toast = useToast()

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
        },
      ]}
    >
      <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
        {/* Visual anchor */}
        <View style={[styles.iconWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="cube-outline" size={32} color={colors.textSecondary} />
        </View>

        {/* Text */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          NO_ARTIFACTS_FOUND
        </Text>

        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          // THE_ARCHIVE_IS_EMPTY
          {'\n'}
          Initialize upload sequence to populate the database or recalibrate search parameters.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          {onReset && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync()
                onReset()
                toast.show('Parameters reset', 'info')
              }}
              style={({ pressed }) => [
                styles.secondary,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed ? colors.border : 'transparent',
                },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>
                RESET_FILTERS
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              Haptics.selectionAsync()
              router.push('/upload')
            }}
            style={({ pressed }) => [
              styles.primary,
              {
                backgroundColor: colors.textPrimary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              },
            ]}
          >
            <Text style={[styles.primaryText, { color: colors.background }]}>
              INITIALIZE_UPLOAD
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  iconWrap: {
    marginBottom: 8,
    width: 80,
    height: 80,
    borderRadius: 24, // softer technical feel
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(15),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  desc: {
    fontSize: normalize(11),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#666',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
    marginBottom: 16,
  },
  actions: {
    width: '100%',
    gap: 12,
    maxWidth: 300,
  },
  secondary: {
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: normalize(11),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
    letterSpacing: 1,
  },
  primary: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryText: {
    fontSize: normalize(11),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
})
