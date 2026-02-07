import { View, TextInput, StyleSheet, Platform } from 'react-native'
import { useRef, useEffect, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { lightColors, darkColors } from '../../theme/colors'
import { useTheme } from '@/src/theme/ThemeProvider'
import { FONTS } from '@/src/theme/fonts'

type Props = {
  value: string
  onChange: (v: string) => void
  onComplete: () => void
  disabled?: boolean
  error?: boolean
}

const MONO = FONTS.mono

export default function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  error,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const inputs = useRef<TextInput[]>([])
  const shake = useSharedValue(0)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // Auto-submit when full
  useEffect(() => {
    if (value.length === 6) {
      onComplete()
    }
  }, [value])

  // Error Shake Animation
  useEffect(() => {
    if (!error) return
    shake.value = withSequence(
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-5, { duration: 50, easing: Easing.linear }),
      withTiming(5, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear })
    )
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  }, [error])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }))

  return (
    <Animated.View style={[styles.row, animatedContainerStyle]}>
      {Array.from({ length: 6 }).map((_, i) => {
        const isFocused = focusedIndex === i
        const isFilled = Boolean(value[i])

        return (
          <TextInput
            key={i}
            ref={(el) => { if (el) inputs.current[i] = el }}
            value={value[i] || ''}
            editable={!disabled}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden
            selectTextOnFocus
            style={[
              styles.box,
              {
                backgroundColor: theme === 'dark'
                  ? (isFilled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)')
                  : (isFilled ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)'),
                borderColor: error
                  ? colors.danger
                  : isFocused
                    ? (theme === 'dark' ? '#fff' : '#000')
                    : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                color: colors.textPrimary,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            onChangeText={(t) => {
              if (!/^\d?$/.test(t)) return
              const next = value.split('')
              next[i] = t
              const nextStr = next.join('')
              onChange(nextStr)

              if (t && i < 5) inputs.current[i + 1]?.focus()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !value[i] && i > 0) {
                inputs.current[i - 1]?.focus()
              }
            }}
          />
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  box: {
    width: 44,
    height: 54,
    borderRadius: 8,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: MONO,
    fontWeight: '700',
  },
})
