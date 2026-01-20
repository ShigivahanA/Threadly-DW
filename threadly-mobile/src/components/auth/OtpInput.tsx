import { View, TextInput, StyleSheet, useColorScheme } from 'react-native'
import { useRef, useEffect, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

import { lightColors, darkColors } from '../../theme/colors'

type Props = {
  value: string
  onChange: (v: string) => void
  onComplete: () => void
  disabled?: boolean
  error?: boolean
}

export default function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  error,
}: Props) {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  const inputs = useRef<TextInput[]>([])
  const shake = useSharedValue(0)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  /* ======================
     Auto submit
  ====================== */
  useEffect(() => {
    if (value.length === 6) {
      onComplete()
    }
  }, [value])

  /* ======================
     Error feedback
  ====================== */
  useEffect(() => {
    if (!error) return

    shake.value = withSequence(
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 40 })
    )

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
  }, [error])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }))

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      {Array.from({ length: 6 }).map((_, i) => {
        const isFocused = focusedIndex === i
        const hasValue = Boolean(value[i])

        return (
          <TextInput
            key={i}
            ref={(el) => {
              if (el) inputs.current[i] = el
            }}
            value={value[i] || ''}
            editable={!disabled}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden
            selectTextOnFocus
            style={[
              styles.box,
              {
                backgroundColor: colors.surface,
                borderColor: error
                  ? colors.danger
                  : isFocused
                  ? colors.accent
                  : colors.border,
                color: colors.textPrimary,
                opacity: disabled ? 0.5 : 1,
              },
              hasValue && { backgroundColor: colors.background },
            ]}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            onChangeText={(t) => {
              if (!/^\d?$/.test(t)) return

              const next = value.split('')
              next[i] = t
              onChange(next.join(''))

              if (t && i < 5) {
                inputs.current[i + 1]?.focus()
              }
            }}
            onKeyPress={({ nativeEvent }) => {
              if (
                nativeEvent.key === 'Backspace' &&
                !value[i] &&
                i > 0
              ) {
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
    marginVertical: 16,
  },

  box: {
    width: 48,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
})
