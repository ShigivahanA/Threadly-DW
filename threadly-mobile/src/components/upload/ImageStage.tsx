import { View, Image, Text, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import PrimaryButton from '../auth/PrimaryButton'

type UploadedImage = {
  url: string
  publicId: string
}

type Props = {
  image: string | null
  uploaded: UploadedImage | null
  loading: boolean
  onPickCamera: () => void
  onPickGallery: () => void
  onUpload: () => void
  onRemove: () => void
}

export default function ImageStage({
  image,
  uploaded,
  onPickCamera,
  onPickGallery,
  onUpload,
  onRemove,
  loading,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const { showActionSheetWithOptions } = useActionSheet()

  const openPicker = async () => {
    await Haptics.selectionAsync()

    showActionSheetWithOptions(
      {
        options: ['Take photo', 'Choose from library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) onPickCamera()
        if (index === 1) onPickGallery()
      }
    )
  }

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onRemove()
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={openPicker}
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
          <View
            style={[
              styles.placeholder,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Text style={{ color: colors.textPrimary }}>
              Tap to add image
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              Camera or library
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
})
