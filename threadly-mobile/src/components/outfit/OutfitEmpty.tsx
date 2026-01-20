import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

export default function OutfitEmpty() {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={styles.wrap}
    >
      <Text
        style={[
          styles.text,
          { color: colors.textSecondary },
        ]}
      >
        No outfits saved yet
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },

  text: {
    fontSize: 14,
  },
})
