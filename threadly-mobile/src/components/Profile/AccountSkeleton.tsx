import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

const SkeletonElement = ({ style, theme }: any) => {
  const opacity = useSharedValue(0.3)
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    )
  }, [])
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  return (
    <Animated.View style={[
      style,
      { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
      animatedStyle
    ]} />
  )
}

export default function AccountSkeleton() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonElement theme={theme} style={styles.smallIcon} />
        <SkeletonElement theme={theme} style={styles.title} />
      </View>

      <View style={styles.content}>

        {/* Identity Config */}
        <View style={styles.section}>
          <SkeletonElement theme={theme} style={styles.sectionTitle} />
          <View style={[styles.module, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            {/* Name */}
            <View style={styles.row}>
              <SkeletonElement theme={theme} style={styles.label} />
              <SkeletonElement theme={theme} style={styles.input} />
            </View>
            <View style={{ height: 1, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
            {/* Email */}
            <View style={styles.row}>
              <SkeletonElement theme={theme} style={styles.label} />
              <SkeletonElement theme={theme} style={styles.input} />
            </View>
            <View style={{ padding: 16 }}>
              <SkeletonElement theme={theme} style={styles.button} />
            </View>
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <SkeletonElement theme={theme} style={styles.sectionTitle} />
          <View style={[styles.module, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            {/* Sessions */}
            <View style={styles.actionRow}>
              <SkeletonElement theme={theme} style={styles.icon} />
              <SkeletonElement theme={theme} style={{ width: 140, height: 16, borderRadius: 4 }} />
            </View>
            <View style={{ height: 1, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
            {/* Password */}
            <View style={styles.actionRow}>
              <SkeletonElement theme={theme} style={styles.icon} />
              <SkeletonElement theme={theme} style={{ width: 120, height: 16, borderRadius: 4 }} />
            </View>
          </View>
        </View>

        {/* Export / Danger Mock */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <SkeletonElement theme={theme} style={{ width: '100%', height: 50, borderRadius: 16 }} />
          <SkeletonElement theme={theme} style={{ width: 100, height: 14, borderRadius: 4, alignSelf: 'center', marginTop: 12 }} />
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: 32,
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallIcon: {
    width: 40, height: 40, borderRadius: 20
  },
  title: {
    width: 0, height: 0
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    width: 120,
    height: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  module: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    padding: 16,
    gap: 12,
  },
  label: {
    width: 40,
    height: 10,
    borderRadius: 2,
  },
  input: {
    width: '80%',
    height: 16,
    borderRadius: 4,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 12,
  },
  actionRow: {
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
})
