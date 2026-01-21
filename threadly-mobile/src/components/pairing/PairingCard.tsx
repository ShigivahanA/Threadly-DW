import { View, Image, StyleSheet } from 'react-native'

export default function PairingCard({ item, width }: any) {
  return (
    <View style={[styles.card, { width }]}>
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
    backgroundColor: '#ffffff', // neutral letterbox bg
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // ✅ FULL IMAGE
  },
})
