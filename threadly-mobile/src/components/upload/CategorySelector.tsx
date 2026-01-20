import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import type { WardrobeCategory } from '../../services/wardrobeService'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

const CATEGORIES: WardrobeCategory[] = [
  'shirt',
  'tshirt',
  'pant',
  'jeans',
  'jacket',
  'shoes',
  'other',
]

type Props = {
  value: WardrobeCategory | null
  onSelect: (c: WardrobeCategory) => void
}

export function CategorySelector({ value, onSelect }: Props) {
  const { theme } = useTheme()

  const colors = theme === 'dark' ? darkColors : lightColors
  const [open, setOpen] = useState(false)

  const handleSelect = async (c: WardrobeCategory) => {
    await Haptics.selectionAsync()
    onSelect(c)
    setOpen(false)
  }

  return (
    <>
      {/* Field */}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.fieldText,
            {
              color: value
                ? colors.textPrimary
                : colors.textSecondary,
            },
          ]}
        >
          {value ? value : 'Select category'}
        </Text>

        <Text style={{ color: colors.textSecondary }}>▾</Text>
      </Pressable>

      {/* Bottom Sheet */}
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
            ]}
          >
            Choose category
          </Text>

          {CATEGORIES.map((c) => {
            const active = c === value
            return (
              <Pressable
                key={c}
                onPress={() => handleSelect(c)}
                style={[
                  styles.option,
                  active && {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active
                      ? colors.textPrimary
                      : colors.textSecondary,
                    fontWeight: active ? '600' : '400',
                  }}
                >
                  {c}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </Modal>
    </>
  )
}

/* ======================
   Styles
====================== */
const styles = StyleSheet.create({
  field: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fieldText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheet: {
    padding: spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
})
