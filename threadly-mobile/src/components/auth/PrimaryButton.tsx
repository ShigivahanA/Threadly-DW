import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: Props) {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: colors.accent,
          opacity: disabled || loading ? 0.6 : 1,
        },
      ]}
    >
      {loading ? (
  <ActivityIndicator
    color={scheme === 'dark' ? '#000' : '#fff'}
  />
) : (
  <Text
    style={[
      styles.text,
      { color: scheme === 'dark' ? '#000' : '#fff' }
    ]}
  >
    {title}
  </Text>
)}

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
  },
 text: {
  fontSize: 16,
  fontWeight: '600',
},
})
