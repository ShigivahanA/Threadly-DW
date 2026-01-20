import { View, Text, Pressable, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'

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
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {CATEGORIES.map((c) => {
          const active = value === c
          return (
            <Pressable
              key={c}
              onPress={() => onChange(active ? null : c)}
              style={[
                styles.pill,
                active && styles.active,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  active && styles.textActive,
                ]}
              >
                {c}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {value && (
        <Pressable onPress={onReset}>
          <Text style={styles.reset}>Reset filters</Text>
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
    borderColor: '#ccc',
  },
  active: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  text: {
    fontSize: 13,
    textTransform: 'capitalize',
    color: '#555',
  },
  textActive: {
    color: '#fff',
  },
  reset: {
    fontSize: 12,
    color: '#777',
  },
})
