import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import type { TextInputProps } from 'react-native'

import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

type Props = TextInputProps & {
  label: string
}

export default function Field({
  label,
  style,
  ...inputProps
}: Props) {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <TextInput
        {...inputProps}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
          style,
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
    ...typography.label,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    ...typography.input,
  },
})
