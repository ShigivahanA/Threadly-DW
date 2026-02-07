import { useMemo, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import type { WardrobeCategory } from '../../services/wardrobeService'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

/* ======================================================
   Categories (source of truth)
====================================================== */
const CATEGORIES: WardrobeCategory[] = [
  'tshirt',
  'shirt',
  'top',
  'blouse',
  'tank_top',
  'sweater',
  'hoodie',
  'jacket',
  'coat',
  'blazer',
  'jeans',
  'pants',
  'shorts',
  'skirt',
  'leggings',
  'joggers',
  'dress',
  'jumpsuit',
  'romper',
  'overalls',
  'kurta',
  'saree',
  'lehenga',
  'salwar',
  'dhoti',
  'shoes',
  'sneakers',
  'sandals',
  'heels',
  'flats',
  'boots',
  'school_uniform',
  'sleepwear',
  'onesie',
  'innerwear',
  'nightwear',
  'loungewear',
  'cap',
  'hat',
  'scarf',
  'belt',
  'socks',
  'other',
]

/* ======================================================
   Props
====================================================== */
type Props = {
  value: WardrobeCategory | null
  onSelect: (c: WardrobeCategory) => void
}

/* ======================================================
   Component
====================================================== */
export function CategorySelector({ value, onSelect }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  /* ======================
     Alphabetical order (once)
  ====================== */
  const sortedCategories = useMemo(() => {
    return [...CATEGORIES].sort((a, b) =>
      a.localeCompare(b)
    )
  }, [])

  const normalizedQuery = query.trim().toLowerCase()

  const orderedCategories = useMemo(() => {
    if (!normalizedQuery) return sortedCategories

    const matches = sortedCategories.filter(c =>
      c.replace(/_/g, ' ').toLowerCase().includes(normalizedQuery)
    )

    const nonMatches = sortedCategories.filter(c =>
      !c.replace(/_/g, ' ').toLowerCase().includes(normalizedQuery)
    )

    return [...matches, ...nonMatches]
  }, [normalizedQuery, sortedCategories])


  const handleSelect = async (c: WardrobeCategory) => {
    await Haptics.selectionAsync()
    onSelect(c)
    setQuery('')
    setOpen(false)
  }

  return (
    <>
      {/* ======================
          Field
      ====================== */}
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
          {value ? value.replace(/_/g, ' ') : 'Select category'}
        </Text>
        <Text style={{ color: colors.textSecondary }}>▾</Text>
      </Pressable>

      {/* ======================
          Full Screen Modal
      ====================== */}
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary },
              ]}
            >
              Choose category
            </Text>

            <Pressable onPress={() => setOpen(false)}>
              <Text style={{ color: colors.textSecondary }}>
                Close
              </Text>
            </Pressable>
          </View>

          {/* Search */}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search category"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.search,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
              },
            ]}
          />

          {/* List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {orderedCategories.map((c) => {
              const label = c.replace(/_/g, ' ')
              const match =
                normalizedQuery.length > 0 &&
                label.toLowerCase().includes(normalizedQuery)

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
                      color: match
                        ? '#E53935' // 🔴 highlight match
                        : active
                          ? colors.textPrimary
                          : colors.textSecondary,
                      fontWeight: active || match ? '600' : '400',
                      textTransform: 'capitalize',
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

/* ======================================================
   Styles
====================================================== */
const styles = StyleSheet.create({
  field: {
    height: 52, // Match Field.tsx
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  fieldText: {
    fontSize: 14,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },

  title: {
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  search: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: spacing.lg,
    fontSize: 14,
    fontFamily: 'Courier',
  },

  option: {
    paddingVertical: 16,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
})
