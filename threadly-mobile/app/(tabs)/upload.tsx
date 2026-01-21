import { View, Text, StyleSheet, Image } from 'react-native'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView,useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { ScrollView } from 'react-native'
import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { typography } from '../../src/theme/typography'
import { useToast } from '@/src/components/Toast/ToastProvider'
import PrimaryButton from '../../src/components/auth/PrimaryButton'
import MetadataForm from '../../src/components/upload/MetadataForm'
import { getUploadSignature, uploadToCloudinary } from '../../src/services/uploadService'
import wardrobeService from '../../src/services/wardrobeService'
import type { WardrobeCategory,WardrobeSeason,WardrobeOccasion } from '../../src/services/wardrobeService'
import ImageStage from '@/src/components/upload/ImageStage'
import { useTheme } from '@/src/theme/ThemeProvider'
import ExtractedColors from '@/src/components/upload/ExtractedColors'
import ManualColorPicker from '@/src/components/upload/ManualColorPicker'
type UploadMetaDraft = {
  category: WardrobeCategory | null
  size: string
  colors: string[]
  brand: string
  occasion: WardrobeOccasion
  season: WardrobeSeason
  isFavorite: boolean
  tags: string[]
  notes: string
}


export default function UploadScreen() {
  const toast = useToast()
  const insets = useSafeAreaInsets()
  const TAB_BAR_HEIGHT = 64
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [meta, setMeta] = useState<UploadMetaDraft>({
    category: null,
    size: '',
    colors: [],
    brand: '',
    occasion: 'other',
    season: 'all',
    isFavorite: false,
    tags: [],
    notes: '',
  })

  const ensureGalleryPermission = async () => {
  const { status } =
    await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (status !== 'granted') {
    throw new Error('Gallery permission not granted')
  }
}

const ensureCameraPermission = async () => {
  const { status } =
    await ImagePicker.requestCameraPermissionsAsync()

  if (status !== 'granted') {
    throw new Error('Camera permission not granted')
  }
}

  /* Pick image */
 const pickFromGallery = async () => {
  try {
    await ensureGalleryPermission()

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    })

    if (!result.canceled) {
      Haptics.selectionAsync()
      setImage(result.assets[0].uri)
      setUploaded(null)
    }
  } catch {
    toast.show('Gallery permission denied', 'error')
  }
}


const pickFromCamera = async () => {
  try {
    await ensureCameraPermission()

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.9,
    })

    if (!result.canceled) {
      Haptics.selectionAsync()
      setImage(result.assets[0].uri)
      setUploaded(null)
    }
  } catch {
    toast.show('Camera permission denied', 'error')
  }
}


  /* Upload */
  const handleUpload = async () => {
  if (!image) return

  try {
    setLoading(true)
    const signature = await getUploadSignature()
    const result = await uploadToCloudinary(image, signature)


    const extractedColors =
      result?.colors?.map((c: [string, number]) => c[0]) ?? []

    setUploaded({
      url: result.secure_url,
      publicId: result.public_id,
    })

    // ✅ inject extracted colors into metadata
    setMeta(prev => ({
      ...prev,
      colors: extractedColors,
    }))

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
  } catch (e: any) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    toast.show('Upload failed', 'error')
  } finally {
    setLoading(false)
  }
}

  /* Save */
  const handleSave = async () => {
  if (!uploaded || !meta.category) {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    toast.show('Missing details', 'error')
    return
  }

  try {
    setLoading(true)

    await wardrobeService.addItem({
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
      category: meta.category,      // ✅ now guaranteed
      size: meta.size || undefined,
      colors: meta.colors,
      brand: meta.brand || undefined,
      occasion: meta.occasion,
      season: meta.season,
      isFavorite: meta.isFavorite,
      tags: meta.tags,
      notes: meta.notes || undefined,
    })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    toast.show('Item added to wardrobe', 'success')
    reset()
  } catch {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    toast.show('Could not save item', 'error')
  } finally {
    setLoading(false)
  }
}


  const reset = () => {
    setImage(null)
    setUploaded(null)
    setMeta({
      category: null,
      size: '',
      colors: [],
      brand: '',
      occasion: 'other',
      season: 'all',
      isFavorite: false,
      tags: [],
      notes: '',
    })
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: spacing.xl + insets.bottom + TAB_BAR_HEIGHT },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Add to wardrobe
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color:
                  theme === 'dark'
                    ? colors.textSecondary
                    : colors.textSecondary,
                opacity: theme === 'dark' ? 0.9 : 0.75,
              },
            ]}
          >
            Upload and describe your clothing item
          </Text>
        </Animated.View>

        {/* Image card */}
        <Animated.View entering={FadeInUp.delay(120)}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ImageStage
              image={image}
  uploaded={uploaded}
  loading={loading}
  onPickCamera={pickFromCamera}
  onPickGallery={pickFromGallery}
  onUpload={handleUpload}
  onRemove={reset}
            />
          </View>
        </Animated.View>

        {/* Metadata */}
        {uploaded && (
          <Animated.View
              entering={FadeInUp
                .delay(200)
                .duration(400)
                .springify()
                .damping(14)}
            >

              <View style={styles.colorsSection}>
                  <ExtractedColors
                    colors={meta.colors}
                    onRemove={(color) =>
                      setMeta({
                        ...meta,
                        colors: meta.colors.filter(c => c !== color),
                      })
                    }
                    onManualPick={() => {setShowColorPicker(true)
                      // open manual picker modal (next step)
                    }}
                  />
                  {showColorPicker && (
  <ManualColorPicker
    selected={meta.colors}
    onSelect={(color) => {
      setMeta(prev => ({
        ...prev,
        colors: prev.colors.includes(color)
          ? prev.colors.filter(c => c !== color)
          : [...prev.colors, color],
      }))
    }}
  />
)}
                </View>

              {/* Metadata */}
              <View style={[styles.card, {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },]}>
                <MetadataForm meta={meta} setMeta={setMeta} />

                <PrimaryButton
                  title="Save to wardrobe"
                  loading={loading}
                  onPress={handleSave}
                />
              </View>
            </Animated.View>
          )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  
  safe: { flex: 1 },
  container: {
  padding: spacing.xl,
},
  title: { ...typography.title },
  subtitle: { marginTop: spacing.xs, ...typography.subtitle },
 card: {
  marginTop: spacing.xl,
  padding: spacing.lg,
  borderRadius: 20,
  borderWidth: 1,
  gap: spacing.lg,
  backgroundColor: 'transparent',
  // iOS
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },

  // Android
  // elevation: 3,
},
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  heroCard: {
  marginTop: spacing.lg,
  padding: spacing.md,
  borderRadius: 20,
  borderWidth: 1,
},
colorsSection: {
  marginTop: spacing.lg,
  marginBottom: spacing.md,
},

})
