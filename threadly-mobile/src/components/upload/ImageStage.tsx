import { View, Image, Text, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'

import PrimaryButton from '../auth/PrimaryButton'

type UploadedImage = {
  url: string
  publicId: string
}

type Props = {
  image: string | null
  uploaded: UploadedImage | null
  loading: boolean
  onPick: () => void
  onUpload: () => void
  onRemove: () => void
}

export default function ImageStage({
  image,
  uploaded,
  onPick,
  onUpload,
  onRemove,
  loading,
}: Props) {
  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onRemove()
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPick}
        onLongPress={handleLongPress}
        disabled={loading}
      >
        {image ? (
          <Image
            source={{ uri: uploaded?.url ?? image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Tap to select image
            </Text>
            <Text style={styles.subText}>
              Long press to remove
            </Text>
          </View>
        )}
      </Pressable>

      {image && !uploaded && (
        <PrimaryButton
          title="Upload image"
          loading={loading}
          onPress={onUpload}
        />
      )}
    </View>
  )
}

/* ======================
   Styles
====================== */
const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
  },

  placeholder: {
    height: 260,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  placeholderText: {
    fontSize: 15,
    fontWeight: '600',
  },

  subText: {
    marginTop: 6,
    fontSize: 12,
    opacity: 0.6,
  },
})
