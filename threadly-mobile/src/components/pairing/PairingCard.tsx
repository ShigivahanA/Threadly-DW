import { View, Image, StyleSheet } from 'react-native'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

export default function PairingCard({ item, width }: any) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={[
      styles.card,
      {
        width,
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        backgroundColor: colors.background
      }
    ]}>
      {/* Shadow Layer behind? or just on card */}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 3 / 4, // Taller portrait
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 16, // Padding to prevent edge touching
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
