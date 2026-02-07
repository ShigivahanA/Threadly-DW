import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { normalize } from '@/src/utils/responsive'
import { useTheme } from '@/src/theme/ThemeProvider'
import { FONTS } from '@/src/theme/fonts'

type Props = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'danger'
}

const MONO = FONTS.mono

/* --- Internal Spinner Component --- */
const Spinner = ({ color }: { color: string }) => {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 24,
          height: 24,
          borderWidth: 2,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRadius: 12,
        },
      ]}
    />
  )
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  // In our design, primary buttons usually have inverted text color
  const textColor = theme === 'dark' ? '#000' : '#fff'
  const bgColor = variant === 'danger'
    ? colors.danger
    : theme === 'dark' ? '#fff' : '#000' // High contrast button

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withTiming(0.97, { duration: 100, easing: Easing.out(Easing.quad) })
    }
  }

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) })
    }
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: bgColor,
            opacity: disabled ? 0.5 : (pressed ? 0.9 : 1),
          },
        ]}
      >
        {loading ? (
          <Spinner color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    fontSize: normalize(16),
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
