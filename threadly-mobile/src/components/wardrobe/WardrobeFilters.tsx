import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

const CATEGORIES = ['shirt', 'tshirt', 'pant', 'jeans', 'jacket', 'shoes']

export default function WardrobeFilters({
  value,
  onChange,
  onReset,
}: {
  value: string | null
  onChange: (v: string | null) => void
  onReset: () => void
}) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {CATEGORIES.map((c) => {
          const active = value === c

          return (
            <Pressable
              key={c}
              onPress={() => onChange(active ? null : c)}
              style={[
                styles.pill,
                {
                  backgroundColor: active
                    ? colors.textPrimary
                    : colors.surface,
                  borderColor: active
                    ? colors.textPrimary
                    : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 13,
                  textTransform: 'capitalize',
                  color: active
                    ? colors.background
                    : colors.textSecondary,
                  fontWeight: active ? '600' : '500',
                }}
              >
                {c}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {value && (
        <Pressable onPress={onReset}>
          <Text
            style={[
              styles.reset,
              { color: colors.textSecondary },
            ]}
          >
            Reset filters
          </Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  reset: {
    fontSize: 12,
  },
})
