import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useState, useMemo } from 'react'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { normalize } from '@/src/utils/responsive'
import { FONTS } from '@/src/theme/fonts'

type Props = {
  selected: string[]
  onSelect: (color: string) => void
  onClose?: () => void
}

export default function ManualColorPicker({
  selected,
  onSelect,
  onClose,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [hue, setHue] = useState(0) // 0-360
  const [sat, setSat] = useState(100) // 0-100
  const [lit, setLit] = useState(50) // 0-100

  const currentColor = `hsl(${hue}, ${sat}%, ${lit}%)`

  const handleAdd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    onSelect(currentColor)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>

      {/* Header / Preview */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>COLOR_SYNTHESIZER</Text>
            {onClose && (
              <Pressable onPress={() => {
                Haptics.selectionAsync()
                onClose()
              }} hitSlop={12}>
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={[styles.previewBox, { backgroundColor: currentColor, borderColor: colors.border }]} />
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              H:{Math.round(hue)} S:{Math.round(sat)} L:{Math.round(lit)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {/* HUE */}
        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>HUE</Text>
          </View>
          <View style={styles.sliderWrap}>
            <LinearGradient
              colors={['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.trackGradient, { borderColor: colors.border }]}
            />
            <Slider
              style={styles.slider}
              minimumValue={0} maximumValue={360} step={1}
              value={hue} onValueChange={setHue}
              thumbTintColor={colors.textPrimary}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
            />
          </View>
        </View>

        {/* SATURATION */}
        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>SATURATION</Text>
          </View>
          <View style={styles.sliderWrap}>
            <LinearGradient
              colors={[`hsl(${hue}, 0%, ${lit}%)`, `hsl(${hue}, 100%, ${lit}%)`]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.trackGradient, { borderColor: colors.border }]}
            />
            <Slider
              style={styles.slider}
              minimumValue={0} maximumValue={100} step={1}
              value={sat} onValueChange={setSat}
              thumbTintColor={colors.textPrimary}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
            />
          </View>
        </View>

        {/* LIGHTNESS */}
        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>LIGHTNESS</Text>
          </View>
          <View style={styles.sliderWrap}>
            <LinearGradient
              colors={['#000', `hsl(${hue}, ${sat}%, 50%)`, '#fff']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.trackGradient, { borderColor: colors.border }]}
            />
            <Slider
              style={styles.slider}
              minimumValue={0} maximumValue={100} step={1}
              value={lit} onValueChange={setLit}
              thumbTintColor={colors.textPrimary}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
            />
          </View>
        </View>
      </View>

      {/* Action */}
      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [
          styles.addBtn,
          {
            backgroundColor: colors.textPrimary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <Ionicons name="add" size={20} color={colors.background} />
        <View style={{ width: 8 }} />
        <Text style={[styles.addBtnText, { color: colors.background }]}>INJECT_COLOR_DATA</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    gap: 24,
    marginTop: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.mono,
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontFamily: FONTS.mono,
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  previewBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  controls: {
    gap: 20,
  },
  controlGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sliderWrap: {
    height: 32,
    justifyContent: 'center',
    borderRadius: 16,
    position: 'relative',
  },
  trackGradient: {
    position: 'absolute',
    left: 0, right: 0, top: 8, bottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  slider: {
    width: '100%',
    height: 40, // Height to accommodate touch target
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: {
    fontFamily: FONTS.technical,
    fontSize: normalize(11), // Reduced from 14
    fontWeight: '700',
    letterSpacing: 1,
  }
})
