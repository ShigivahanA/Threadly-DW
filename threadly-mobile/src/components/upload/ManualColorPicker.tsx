import { View, Pressable, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

const COLOR_PALETTE = [
  '#000000',
  '#FFFFFF',
  '#9CA3AF',
  '#6B7280',
  '#7C2D12',
  '#92400E',
  '#DC2626',
  '#2563EB',
  '#16A34A',
  '#CA8A04',
  '#9333EA',
  '#EC4899',
  '#F97316',
]

type Props = {
  selected: string[]
  onSelect: (color: string) => void
}

export default function ManualColorPicker({
  selected,
  onSelect,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.grid}>
      {COLOR_PALETTE.map(color => {
        const active = selected.includes(color)

        return (
          <Pressable
            key={color}
            onPress={() => onSelect(color)}
            style={[
              styles.swatch,
              {
                backgroundColor: color,
                borderColor: active
                  ? colors.textPrimary
                  : colors.border,
                borderWidth: active ? 2 : 1,
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
})
