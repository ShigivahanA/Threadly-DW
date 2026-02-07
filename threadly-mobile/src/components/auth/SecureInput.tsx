import { View, TextInput, Pressable, StyleSheet, Text, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { lightColors, darkColors } from '../../theme/colors'
import { useTheme } from '@/src/theme/ThemeProvider'
import { FONTS } from '@/src/theme/fonts'

type Props = {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  keyboardType?: any
  maxLength?: number
  label?: string
  style?: any
}

const MONO = FONTS.mono

export default function SecureInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  label,
  style,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const [visible, setVisible] = useState(false)

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>
          // {label.toUpperCase()}
        </Text>
      )}

      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          secureTextEntry={!visible}
          keyboardType={keyboardType}
          maxLength={maxLength}
          style={[
            styles.input,
            {
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              color: colors.textPrimary,
            },
            style,
          ]}
        />

        <Pressable
          onPress={() => setVisible(v => !v)}
          hitSlop={12}
          style={styles.eye}
        >
          <Ionicons
            name={visible ? 'eye-off' : 'eye'}
            size={20}
            color={theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
          />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: MONO,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48, // Room for eye icon
    fontSize: 14,
    fontFamily: MONO,
  },
  eye: {
    position: 'absolute',
    right: 16,
  },
})
