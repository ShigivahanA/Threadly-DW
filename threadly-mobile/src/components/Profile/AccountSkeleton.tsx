import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

export default function AccountSkeleton() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const skeletonBg =
    theme === 'dark' ? '#1a1a1a' : '#e5e7eb'

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header skeleton */}
      <View style={styles.header}>
        <View
          style={[
            styles.titleSkeleton,
            { backgroundColor: skeletonBg },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Profile card */}
        <SkeletonCard skeletonBg={skeletonBg}>
          <SkeletonLine width="60%" />
          <SkeletonLine width="80%" />
          <SkeletonButton />
        </SkeletonCard>

        {/* Sessions card */}
        <SkeletonCard skeletonBg={skeletonBg}>
          <SkeletonLine width="40%" />
          <SkeletonRow />
          <SkeletonRow />
        </SkeletonCard>

        {/* Export card */}
        <SkeletonCard skeletonBg={skeletonBg}>
          <SkeletonButton />
        </SkeletonCard>

        {/* Security card */}
        <SkeletonCard skeletonBg={skeletonBg}>
          <SkeletonLine width="70%" />
          <SkeletonButton />
        </SkeletonCard>

        {/* Danger zone */}
        <SkeletonCard skeletonBg={skeletonBg}>
          <SkeletonButton />
          <SkeletonButton danger />
        </SkeletonCard>
      </View>
    </SafeAreaView>
  )
}

/* ---------------- Small building blocks ---------------- */

function SkeletonCard({
  children,
  skeletonBg,
}: any) {
  return (
    <View
      style={[
        styles.card,
        { borderColor: skeletonBg },
      ]}
    >
      {children}
    </View>
  )
}

function SkeletonLine({ width = '100%' }: any) {
  return (
    <View
      style={[
        styles.line,
        { width },
      ]}
    />
  )
}

function SkeletonRow() {
  return (
    <View style={styles.row}>
      <SkeletonLine width="55%" />
      <SkeletonLine width="20%" />
    </View>
  )
}

function SkeletonButton({ danger }: any) {
  return (
    <View
      style={[
        styles.button,
        danger && { opacity: 0.6 },
      ]}
    />
  )
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  titleSkeleton: {
    width: 120,
    height: 24,
    borderRadius: 6,
  },

  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },

  line: {
    height: 14,
    borderRadius: 6,
    backgroundColor: lightColors.textSecondary,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: lightColors.textSecondary,
  },
})
