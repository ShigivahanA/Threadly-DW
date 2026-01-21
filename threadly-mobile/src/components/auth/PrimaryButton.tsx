import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

type Props = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'danger'
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  variant
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const textColor = theme === 'dark' ? '#000' : '#fff'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: variant === 'danger'
    ? colors.danger
    : colors.accent,
          opacity: disabled || loading ? 0.6 : 1,
        },
      ]}
    >
      {/* Invisible text to lock width */}
      <Text style={[styles.text, { color: textColor, opacity: 0 }]}>
        {title}
      </Text>

      {/* Actual content */}
      <View style={styles.overlay}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
})
