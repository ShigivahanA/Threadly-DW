import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { useState } from 'react'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = {
  imageUri: string
  colors: string[]
  onAdd: (color: string) => void
  onRemove: (color: string) => void
}

const SAMPLE_COLORS = [
  '#111827',
  '#6B7280',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
]

export default function ColorPickerOverlay({
  imageUri,
  colors,
  onAdd,
  onRemove,
}: Props) {
  const { theme } = useTheme()
  const palette = theme === 'dark' ? darkColors : lightColors
  const [active, setActive] = useState(false)

  const pickColor = async () => {
    if (!active) return

    const color =
      SAMPLE_COLORS[Math.floor(Math.random() * SAMPLE_COLORS.length)]

    if (!colors.includes(color)) {
      await Haptics.selectionAsync()
      onAdd(color)
    }
  }

  return (
    <View style={styles.wrap}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: palette.textSecondary }]}>
          Pick colors from image
        </Text>

        <Pressable
          onPress={() => {
            Haptics.selectionAsync()
            setActive((p) => !p)
          }}
        >
          <Text
            style={[
              styles.action,
              {
                color: active
                  ? palette.textPrimary
                  : palette.textSecondary,
              },
            ]}
          >
            {active ? 'Tap image to pick' : 'Activate picker'}
          </Text>
        </Pressable>
      </View>

      {/* Image + overlay */}
      <View
        style={[
          styles.imageWrap,
          {
            borderColor: active
              ? palette.textPrimary
              : palette.border,
          },
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Tap overlay */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={pickColor}
          disabled={!active}
        />

        {!active && (
          <View style={styles.centerHint}>
            <Text style={styles.hintText}>
              Activate to pick colors
            </Text>
          </View>
        )}
      </View>

      {/* Selected colors */}
      {colors.length > 0 && (
        <View style={styles.colorsRow}>
          {colors.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Light
                )
                onRemove(c)
              }}
              style={[
                styles.swatch,
                { backgroundColor: c },
              ]}
            >
              <Text style={styles.remove}>×</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
  },

  action: {
    fontSize: 12,
    fontWeight: '600',
  },

  imageWrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 260,
  },

  centerHint: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  hintText: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  remove: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
})
