import { View, Image, StyleSheet } from 'react-native'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function OutfitItemCard({ item,width }: any) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View
      style={[
        styles.card ,{ width }
      ]}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
   width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
