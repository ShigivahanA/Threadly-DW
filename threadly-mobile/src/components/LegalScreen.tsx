import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.xxl },
        ]}
      >
        <Text
          style={[
            styles.updated,
            { color: colors.textSecondary },
          ]}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
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
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  back: {
    padding: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },

  updated: {
    fontSize: 12,
    opacity: 0.7,
  },

  section: {
    gap: spacing.xs,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },

  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
