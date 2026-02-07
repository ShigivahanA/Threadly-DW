import { View, Text, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props<T extends string> = {
  value: T[]
  options: T[]
  onChange: (v: T) => void
}

export default function ChipSelector<T extends string>({
  value,
  options,
  onChange,
}: Props<T>) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.wrap}>
      {options.map(option => {
        const active = value.includes(option)
        return (
          <Pressable
            key={option}
            onPress={async () => {
              await Haptics.selectionAsync()
              onChange(option)
            }}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active ? colors.textPrimary : 'transparent',
                borderColor: active ? colors.textPrimary : colors.border,
                opacity: pressed ? 0.7 : 1,
              }
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: active ? colors.background : colors.textSecondary,
                  fontWeight: active ? '700' : '500',
                },
              ]}
            >
              {option.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8, // Rectangular tag look
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
})
