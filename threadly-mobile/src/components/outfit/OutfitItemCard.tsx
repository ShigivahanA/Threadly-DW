import { View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function OutfitItemCard({ item, width }: any) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <View style={[styles.card, { width: width || '100%', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
