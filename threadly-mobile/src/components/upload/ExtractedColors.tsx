import { View, Text, Pressable, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

type Props = {
  colors: string[]
  onRemove: (color: string) => void
  onManualPick: () => void
}

export default function ExtractedColors({
  colors,
  onRemove,
  onManualPick,
}: Props) {
  const { theme } = useTheme()
  const palette = theme === 'dark' ? darkColors : lightColors
  const isDark = theme === 'dark'

  if (colors.length === 0) return null

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>
        Colors
      </Text>

      <View style={styles.row}>
        {colors.map((c) => (
          <View key={c} style={styles.chipWrap}>
            {/* Color circle */}
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: c,
                  borderColor: palette.border,
                },
              ]}
            />

            {/* Remove button */}
            <Pressable
              onPress={() => onRemove(c)}
              hitSlop={8}
              style={[
                styles.removeBtn,
                {
                  backgroundColor: isDark
                    ? palette.surface
                    : palette.textPrimary,
                },
              ]}
            >
              <Text
                style={{
                  color: isDark
                    ? palette.textPrimary
                    : palette.background,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                ×
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

<Pressable onPress={onManualPick}>
  <Text
    style={[
      styles.manual,
      { color: palette.textSecondary },
    ]}
  >
    Pick colors manually
  </Text>
</Pressable>

    </View>
  )
}
const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  chipWrap: {
    width: 36,
    height: 36,
  },

  chip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },

  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',

    // subtle depth
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  manual: {
    fontSize: 13,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
})
