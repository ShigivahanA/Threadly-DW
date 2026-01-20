import { View, Text, StyleSheet, Switch, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { spacing } from '../../theme/spacing'
import { lightColors, darkColors } from '../../theme/colors'
import Field from '../auth/Field'
import { CategorySelector } from './CategorySelector'

import type {
  WardrobeCategory,
  WardrobeOccasion,
  WardrobeSeason,
} from '../../services/wardrobeService'

/* ======================
   Constants
====================== */
const OCCASIONS: WardrobeOccasion[] = [
  'casual',
  'formal',
  'party',
  'ethnic',
  'sports',
  'other',
]

const SEASONS: WardrobeSeason[] = ['summer', 'winter', 'all']

/* ======================
   Types
====================== */
export type UploadMetaDraft = {
  category: WardrobeCategory | null
  size: string
  colors: string[]
  brand: string
  occasion: WardrobeOccasion
  season: WardrobeSeason
  isFavorite: boolean
  tags: string[]
  notes: string
}

type Props = {
  meta: UploadMetaDraft
  setMeta: (v: UploadMetaDraft) => void
}

/* ======================
   Component
====================== */
export default function MetadataForm({ meta, setMeta }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const pickChip = async <T extends string>(
    key: keyof UploadMetaDraft,
    value: T
  ) => {
    await Haptics.selectionAsync()
    setMeta({ ...meta, [key]: value })
  }

  return (
    <View style={styles.wrap}>
      {/* Category */}
      <CategorySelector
        value={meta.category}
        onSelect={(c) =>
          setMeta({ ...meta, category: c })
        }
      />

      {/* Size */}
      <Field
        label="Size"
        value={meta.size}
        onChangeText={(v) =>
          setMeta({ ...meta, size: v })
        }
        placeholder="M / 32 / XL"
      />

      {/* Brand */}
      <Field
        label="Brand"
        value={meta.brand}
        onChangeText={(v) =>
          setMeta({ ...meta, brand: v })
        }
      />

      {/* Occasion */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Occasion
      </Text>
      <View style={styles.row}>
        {OCCASIONS.map((o) => {
          const active = meta.occasion === o
          return (
            <Pressable
              key={o}
              onPress={() => pickChip('occasion', o)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.textPrimary
                    : colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: active
                    ? colors.background
                    : colors.textSecondary,
                  fontWeight: active ? '600' : '500',
                }}
              >
                {o}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* Season */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Season
      </Text>
      <View style={styles.row}>
        {SEASONS.map((s) => {
          const active = meta.season === s
          return (
            <Pressable
              key={s}
              onPress={() => pickChip('season', s)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.textPrimary
                    : colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: active
                    ? colors.background
                    : colors.textSecondary,
                  fontWeight: active ? '600' : '500',
                }}
              >
                {s}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* Favorite */}
      <View style={styles.favoriteRow}>
        <Text style={{ color: colors.textPrimary }}>
          Mark as favorite
        </Text>
        <Switch
          value={meta.isFavorite}
          onValueChange={(v) =>
            setMeta({ ...meta, isFavorite: v })
          }
          trackColor={{
            false: colors.border,
            true: colors.textPrimary,
          }}
          thumbColor={colors.background}
        />
      </View>

      {/* Notes */}
      <Field
        label="Notes"
        value={meta.notes}
        onChangeText={(v) =>
          setMeta({ ...meta, notes: v })
        }
        multiline
        style={styles.notes}
      />
    </View>
  )
}

/* ======================
   Styles
====================== */
const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    minHeight: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  notes: {
    height: 100,
    textAlignVertical: 'top',
  },
})
