import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { useEffect } from 'react'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Section = {
  title: string
  text: string
}

type Props = {
  title: string
  sections: Section[]
}

export default function LegalScreen({ title, sections }: Props) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const router = useRouter()
  const TAB_BAR_HEIGHT = 64

  // Ambient Blobs
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 10000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))


  const goBack = async () => {
    await Haptics.selectionAsync()
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Blobs */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#507bb7ff' : '#cd97d2ff', // Muted Slate
            top: -100, right: -100, width: 400, height: 400, opacity: 0.1,
          },
          blob1Style
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#7a8492ff' : '#896cb3ff', // Muted Slate
            bottom: -50, left: -80, width: 350, height: 350, opacity: 0.1,
          },
          blob2Style
        ]}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(600).easing(Easing.out(Easing.cubic))}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <Pressable onPress={goBack} hitSlop={8} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.xl + insets.bottom + TAB_BAR_HEIGHT },
        ]}
      >
        <Animated.Text
          entering={FadeInDown.delay(100).duration(600).easing(Easing.out(Easing.cubic))}
          style={[
            styles.updated,
            { color: colors.textSecondary },
          ]}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Animated.Text>

        {sections.map((section, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(200 + (index * 100)).duration(600).easing(Easing.out(Easing.cubic))}
            style={styles.section}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textPrimary },
              ]}
            >
              {section.title}
            </Text>

            <Text
              style={[
                styles.sectionText,
                { color: colors.textSecondary },
              ]}
            >
              {section.text}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  )
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },

  back: {
    padding: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },

  updated: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2
  },

  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9
  },
})
