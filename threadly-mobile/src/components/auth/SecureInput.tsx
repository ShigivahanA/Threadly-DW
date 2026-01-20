import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Props = {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  keyboardType?: any
  maxLength?: number
}

export default function SecureInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: Props) {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors
  const [visible, setVisible] = useState(false)

  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={!visible}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
      />

      <Pressable
        onPress={() => setVisible(v => !v)}
        hitSlop={12}
        style={styles.eye}
      >
        <Ionicons
          name={visible ? 'eye-off' : 'eye'}
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingRight: 44, // room for eye
    fontSize: 16,
  },
  eye: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
})
