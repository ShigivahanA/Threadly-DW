import { View, Text, TextInput, StyleSheet, Platform } from 'react-native'
import type { TextInputProps } from 'react-native'

import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

import { normalize } from '@/src/utils/responsive'

type Props = TextInputProps & {
  label: string
}

export default function Field({
  label,
  style,
  ...inputProps
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>
        {label.toUpperCase()}
      </Text>

      <TextInput
        {...inputProps}
        placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
        style={[
          styles.input,
          {
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            color: colors.textPrimary,
          },
          style,
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: normalize(10),
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: 12, // Sharper
    paddingHorizontal: 16,
    fontSize: normalize(14),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Technical input
  },
})
