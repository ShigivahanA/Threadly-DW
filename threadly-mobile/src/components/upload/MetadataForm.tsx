import { View, Text, StyleSheet, Switch } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { spacing } from '../../theme/spacing'
import { lightColors, darkColors } from '../../theme/colors'
import Field from '../auth/Field'
import { CategorySelector } from './CategorySelector'
import ChipSelector from '@/src/components/upload/ChipSelector'
import type {
  WardrobeCategory,
  WardrobeOccasion,
  WardrobeSeason,
} from '../../services/wardrobeService'
import { normalize } from '@/src/utils/responsive'

/* ======================================================
   Constants (MUST MATCH BACKEND ENUMS EXACTLY)
====================================================== */

const OCCASIONS: WardrobeOccasion[] = [
  'beach',
  'casual',
  'ethnic',
  'festival',
  'formal',
  'other',
  'party',
  'sports',
  'travel',
  'work',
]

const SEASONS: WardrobeSeason[] = [
  'all',
  'autumn',
  'monsoon',
  'spring',
  'summer',
  'winter',
]

/* ======================================================
   Types
====================================================== */

export type UploadMetaDraft = {
  category: WardrobeCategory | null
  size: string
  colors: string[]
  brand: string
  occasion: WardrobeOccasion[]
  season: WardrobeSeason[]
  isFavorite: boolean
  tags: string[]
  notes: string
}

type Props = {
  meta: UploadMetaDraft
  setMeta: (v: UploadMetaDraft) => void
}

/* ======================================================
   Component
====================================================== */

export default function MetadataForm({ meta, setMeta }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  /**
   * Toggle helper for multi-select arrays
   * Includes special handling for `season: ['all']`
   */
  const toggleArrayValue = async <T extends string>(
    key: 'occasion' | 'season',
    value: T
  ) => {
    await Haptics.selectionAsync()

    // Special rule: season = ['all'] must be exclusive
    if (key === 'season' && value === 'all') {
      setMeta({
        ...meta,
        season: ['all'],
      })
      return
    }

    if (key === 'season' && meta.season.includes('all')) {
      setMeta({
        ...meta,
        season: [value as WardrobeSeason],
      })
      return
    }

    setMeta({
      ...meta,
      [key]: (meta[key] as string[]).includes(value)
        ? (meta[key] as string[]).filter(v => v !== value)
        : [...meta[key], value],
    })
  }

  return (
    <View style={styles.wrap}>
      {/* ======================
          Category
      ====================== */}
      <CategorySelector
        value={meta.category}
        onSelect={(category) =>
          setMeta({ ...meta, category })
        }
      />

      {/* ======================
          Size
      ====================== */}
      <Field
        label="Size"
        value={meta.size}
        onChangeText={(size) =>
          setMeta({ ...meta, size })
        }
        placeholder="M / 32 / XL"
      />

      {/* ======================
          Brand
      ====================== */}
      <Field
        label="Brand"
        value={meta.brand}
        onChangeText={(brand) =>
          setMeta({ ...meta, brand })
        }
      />

      {/* ======================
          Occasion (Multi-select)
      ====================== */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Occasion
      </Text>

      <ChipSelector<WardrobeOccasion>
        value={meta.occasion}
        options={OCCASIONS}
        onChange={(occasion) =>
          toggleArrayValue('occasion', occasion)
        }
      />

      {/* ======================
          Season (Multi-select)
      ====================== */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Season
      </Text>

      <ChipSelector<WardrobeSeason>
        value={meta.season}
        options={SEASONS}
        onChange={(season) =>
          toggleArrayValue('season', season)
        }
      />

      {/* ======================
          Favorite
      ====================== */}
      <View style={styles.favoriteRow}>
        <Text style={{ color: colors.textPrimary }}>
          Mark as favorite
        </Text>
        <Switch
          value={meta.isFavorite}
          onValueChange={(isFavorite) =>
            setMeta({ ...meta, isFavorite })
          }
          trackColor={{
            false: colors.border,
            true: colors.textPrimary,
          }}
          thumbColor={colors.background}
        />
      </View>

      {/* ======================
          Notes
      ====================== */}
      <Field
        label="Notes"
        value={meta.notes}
        onChangeText={(notes) =>
          setMeta({ ...meta, notes })
        }
        multiline
        style={styles.notes}
      />
    </View>
  )
}

/* ======================================================
   Styles
====================================================== */

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },

  label: {
    fontSize: normalize(12),
    fontWeight: '500',
    marginBottom: 4,
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
