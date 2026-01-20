import { View, Text, StyleSheet, Image, Alert } from 'react-native'
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

import PrimaryButton from '../../src/components/auth/PrimaryButton'
import MetadataForm from '../../src/components/upload/MetadataForm'
import { getUploadSignature, uploadToCloudinary } from '../../src/services/uploadService'
import wardrobeService from '../../src/services/wardrobeService'
import type { WardrobeCategory,WardrobeSeason,WardrobeOccasion } from '../../src/services/wardrobeService'
import ImageStage from '@/src/components/upload/ImageStage'
import { useTheme } from '@/src/theme/ThemeProvider'
import ExtractedColors from '@/src/components/upload/ExtractedColors'
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
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

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

  /* Pick image */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    })

    if (!result.canceled) {
      Haptics.selectionAsync()
      setImage(result.assets[0].uri)
      setUploaded(null)
    }
  }

  /* Upload */
  const handleUpload = async () => {
  if (!image) return

  try {
    setLoading(true)
    const signature = await getUploadSignature()
    const result = await uploadToCloudinary(image, signature)

    console.log('Cloudinary response:', result)


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
    Alert.alert('Upload failed', e.message)
  } finally {
    setLoading(false)
  }
}

  /* Save */
  const handleSave = async () => {
  if (!uploaded || !meta.category) {
    Alert.alert('Missing details', 'Select category')
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

    Alert.alert('Saved', 'Item added to wardrobe')
    reset()
  } catch {
    Alert.alert('Error', 'Could not save item')
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
            { paddingBottom: spacing.xl + insets.bottom + 16 },
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
              onPick={pickImage}
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

              <ExtractedColors
        colors={meta.colors}
        onRemove={(color) =>
          setMeta({
            ...meta,
            colors: meta.colors.filter(c => c !== color),
          })
        }
        onManualPick={() => {
          // open manual picker modal (next step)
        }}
      />
              {/* Metadata */}
              <View style={[styles.card, { borderColor: colors.border }]}>
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

  // iOS
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },

  // Android
  elevation: 3,
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

})
