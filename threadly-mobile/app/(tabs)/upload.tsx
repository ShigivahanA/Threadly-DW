import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp, Layout } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { typography } from '@/src/theme/typography'
import { useToast } from '@/src/components/Toast/ToastProvider'

import PrimaryButton from '@/src/components/auth/PrimaryButton'
import MetadataForm, { UploadMetaDraft } from '@/src/components/upload/MetadataForm'
import ImageStage from '@/src/components/upload/ImageStage'
import ExtractedColors from '@/src/components/upload/ExtractedColors'
import ManualColorPicker from '@/src/components/upload/ManualColorPicker'

import { getUploadSignature, uploadToCloudinary } from '@/src/services/uploadService'
import wardrobeService from '@/src/services/wardrobeService'

export default function UploadScreen() {
  const toast = useToast()
  const insets = useSafeAreaInsets()
  const TAB_BAR_HEIGHT = 64
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  // -- State --
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [meta, setMeta] = useState<UploadMetaDraft>({
    category: null,
    size: '',
    colors: [],
    brand: '',
    occasion: [],
    season: [],
    isFavorite: false,
    tags: [],
    notes: '',
  })

  // -- Permissions --
  const ensureGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') throw new Error('Gallery permission not granted')
  }

  const ensureCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') throw new Error('Camera permission not granted')
  }

  // -- Pickers --
  const pickFromGallery = async () => {
    try {
      await ensureGalleryPermission()
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
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
        allowsEditing: true,
        exif: true,
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

  // -- Upload --
  const handleUpload = async () => {
    if (!image) return
    try {
      setLoading(true)
      const signature = await getUploadSignature()
      const result = await uploadToCloudinary(image, signature)

      const extractedColors = result?.colors?.map((c: [string, number]) => c[0]) ?? []

      setUploaded({
        url: result.secure_url,
        publicId: result.public_id,
      })

      setMeta(prev => ({
        ...prev,
        colors: extractedColors,
      }))

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (e: any) {
      toast.show('Upload failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // -- Save --
  const handleSave = async () => {
    if (!uploaded || !meta.category) {
      toast.show('Category required', 'error')
      return
    }

    try {
      setLoading(true)
      await wardrobeService.addItem({
        imageUrl: uploaded.url,
        imagePublicId: uploaded.publicId,
        category: meta.category,
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
      toast.show('Artifact archived', 'success')
      reset()
    } catch {
      toast.show('Archival failed', 'error')
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
      occasion: [],
      season: [],
      isFavorite: false,
      tags: [],
      notes: '',
    })
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: spacing.xl + insets.bottom + TAB_BAR_HEIGHT },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header --- */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>INGEST</Text>
            <View style={styles.subtitleRow}>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                   // NEW_ENTRY_PROTOCOL
              </Text>
              <View style={[styles.blinkDot, { backgroundColor: colors.accent }]} />
            </View>
          </Animated.View>

          {/* --- Image Stage --- */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// SOURCE_MEDIA</Text>
          </Animated.View>

          <View style={[styles.stageCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
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

          {/* --- Classification Form --- */}
          {uploaded && (
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>

              <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// ARTIFACT_DATA</Text>
              </View>

              {/* Colors */}
              <View style={[styles.module, { borderColor: colors.border, marginBottom: 20, padding: 16, gap: 16 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>DETECTED_SPECTRUM</Text>

                <ExtractedColors
                  colors={meta.colors}
                  onRemove={(color) => setMeta(p => ({ ...p, colors: p.colors.filter(c => c !== color) }))}
                  onManualPick={() => setShowColorPicker(true)}
                />

                {showColorPicker && (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <ManualColorPicker
                      selected={meta.colors}
                      onClose={() => setShowColorPicker(false)}
                      onSelect={(color) => setMeta(p => ({
                        ...p,
                        colors: p.colors.includes(color) ? p.colors.filter(c => c !== color) : [...p.colors, color]
                      }))}
                    />
                  </Animated.View>
                )}
              </View>

              {/* Form Fields */}
              <View style={[styles.module, { borderColor: colors.border, padding: 16 }]}>
                <MetadataForm meta={meta} setMeta={setMeta} />

                <View style={{ marginTop: 24 }}>
                  <PrimaryButton
                    title="CONFIRM ARCHIVAL"
                    loading={loading}
                    onPress={handleSave}
                  />
                </View>
              </View>

            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: 32,
    paddingTop: 8,
  },
  title: {
    fontSize: normalize(36),
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: normalize(11),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  blinkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
  stageCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 6,
  },
  module: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  label: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    marginBottom: 8,
  }
})
