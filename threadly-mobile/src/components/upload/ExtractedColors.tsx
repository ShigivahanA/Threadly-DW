import { View, Pressable, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { Ionicons } from '@expo/vector-icons'

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

  return (
    <View style={styles.grid}>

      {/* Extracted Chips */}
      {colors.map((c) => (
        <View key={c} style={styles.chipWrap}>
          <View style={[styles.chip, { backgroundColor: c, borderColor: palette.border }]} />
          <Pressable
            onPress={() => onRemove(c)}
            hitSlop={8}
            style={[styles.removeBtn, { backgroundColor: palette.surface, borderColor: palette.border }]}
          >
            <Ionicons name="close" size={10} color={palette.textPrimary} />
          </Pressable>
        </View>
      ))}

      {/* Add Button as a Chip */}
      <Pressable
        onPress={onManualPick}
        style={({ pressed }) => [
          styles.addChip,
          {
            borderColor: palette.border,
            backgroundColor: pressed ? palette.border : 'transparent'
          }
        ]}
      >
        <Ionicons name="add" size={20} color={palette.textSecondary} />
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chipWrap: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  chip: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
  },
  addChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
})
