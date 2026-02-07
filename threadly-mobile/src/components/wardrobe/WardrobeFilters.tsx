import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { normalize } from '@/src/utils/responsive'

const CATEGORIES = ['tshirt',
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
  'other',]

const FilterPill = ({
  label,
  active,
  onPress,
  index,
  colors
}: {
  label: string
  active: boolean
  onPress: () => void
  index: number
  colors: any
}) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => { scale.value = withTiming(0.92, { duration: 100 }) }
  const handlePressOut = () => { scale.value = withTiming(1, { duration: 100 }) }

  const handlePress = () => {
    Haptics.selectionAsync()
    onPress()
  }

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(500)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pill,
          {
            backgroundColor: active ? colors.textPrimary : 'transparent',
            borderColor: active ? colors.textPrimary : colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={{
            fontSize: normalize(10),
            textTransform: 'uppercase',
            color: active ? colors.background : colors.textSecondary,
            fontWeight: active ? '700' : '500',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

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
        {CATEGORIES.map((c, index) => (
          <FilterPill
            key={c}
            label={c}
            active={value === c}
            onPress={() => onChange(value === c ? null : c)}
            index={index}
            colors={colors}
          />
        ))}
      </ScrollView>

      {value && (
        <Animated.View entering={FadeInRight} style={styles.resetContainer}>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onReset(); }}>
            <Text style={[styles.reset, { color: colors.textSecondary }]}>
              ( RESET_FILTERS )
            </Text>
          </Pressable>
        </Animated.View>
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
    paddingRight: 16, // padding at end of scroll
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8, // Square-ish capsule
  },
  resetContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  reset: {
    fontSize: normalize(9),
    fontFamily: 'Courier',
    fontWeight: '600',
    opacity: 0.8,
  },
})
