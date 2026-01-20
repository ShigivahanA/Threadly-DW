import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import * as Haptics from 'expo-haptics'

export default function FavouriteEmpty() {
  const router = useRouter()
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      style={styles.wrap}
    >
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        You haven’t marked anything as favourite yet
      </Text>

      <Pressable
        onPress={async () => {
          await Haptics.selectionAsync()
          router.push('/wardrobe')
        }}
      >
        <Text style={[styles.link, { color: colors.textPrimary }]}>
          Browse wardrobe
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
})
