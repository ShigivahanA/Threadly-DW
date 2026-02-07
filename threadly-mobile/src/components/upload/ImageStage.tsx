import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Image as RNImage } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import * as Haptics from 'expo-haptics'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  FadeIn
} from 'react-native-reanimated'
import { useEffect } from 'react'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import PrimaryButton from '../auth/PrimaryButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PREVIEW_SIZE = 260
const MONO = Platform.OS === 'ios' ? 'Courier' : 'monospace'

type UploadedImage = {
  url: string
  publicId: string
}

type Props = {
  image: string | null
  uploaded: UploadedImage | null
  loading: boolean
  onPickCamera?: () => void
  onPickGallery?: () => void
  onUpload?: () => void
  onRemove?: () => void
  hideUploadActions?: boolean
}

export default function ImageStage({
  image,
  uploaded,
  onPickCamera,
  onPickGallery,
  onUpload,
  onRemove,
  loading,
  hideUploadActions,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const { showActionSheetWithOptions } = useActionSheet()

  // Scanline Animation
  const translateY = useSharedValue(0)
  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(PREVIEW_SIZE, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    )
  }, [])

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const openPicker = async () => {
    await Haptics.selectionAsync()
    showActionSheetWithOptions(
      {
        options: ['Take photo', 'Choose from library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) onPickCamera?.()
        if (index === 1) onPickGallery?.()
      }
    )
  }

  const handleLongPress = async () => {
    if (hideUploadActions) return
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onRemove?.()
  }

  const imageUri = uploaded?.url || image

  const CornerBracket = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const isTop = position.startsWith('t')
    const isLeft = position.endsWith('l')

    return (
      <View style={[
        styles.bracket,
        { borderColor: colors.textPrimary },
        isTop ? { top: -2, borderTopWidth: 2 } : { bottom: -2, borderBottomWidth: 2 },
        isLeft ? { left: -2, borderLeftWidth: 2 } : { right: -2, borderRightWidth: 2 }
      ]} />
    )
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={openPicker}
        onLongPress={handleLongPress}
        disabled={loading}
        style={styles.pressable}
      >
        <View style={[styles.mainWrapper, { borderColor: colors.border }]}>
          {imageUri ? (
            <View style={styles.imageContainer}>
              {Platform.OS === 'android' ? (
                <RNImage
                  key={imageUri}
                  source={{ uri: imageUri }}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
              ) : (
                <ExpoImage
                  key={imageUri}
                  source={imageUri}
                  style={styles.fullImage}
                  contentFit="cover"
                  transition={200}
                />
              )}

              {/* Scanline Effect */}
              <Animated.View style={[styles.scanline, scanlineStyle]} />

              {/* Technical Readout Overlay */}
              <View style={styles.techOverlay}>
                <View style={[styles.statusBadge, { backgroundColor: uploaded ? '#10b981' : '#f59e0b' }]}>
                  <Text style={styles.statusText}>{uploaded ? 'SECURED' : 'PENDING'}</Text>
                </View>

                <View style={styles.dataReadout}>
                  <Text style={styles.readoutText}>// 4.1MP [RAW]</Text>
                  <Text style={styles.readoutText}>// ISO_AUTO</Text>
                  <Text style={styles.readoutText}>// T:_001_A</Text>
                </View>
              </View>

              {/* Viewfinder Brackets */}
              <View style={styles.viewfinderCenter}>
                <View style={[styles.viewLine, { width: 14, height: 1, backgroundColor: colors.textPrimary, opacity: 0.3 }]} />
                <View style={[styles.viewLine, { width: 14, height: 1, backgroundColor: colors.textPrimary, opacity: 0.3, transform: [{ rotate: '90deg' }] }]} />
              </View>

            </View>
          ) : (
            <View style={[styles.placeholder, { backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f9f9f9' }]}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="scan" size={36} color={colors.textSecondary} />
                <View style={[styles.pulseCircle, { borderColor: colors.textPrimary, opacity: 0.1 }]} />
              </View>

              <View style={styles.placeholderText}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>INITIALIZE_SCAN</Text>
                <Text style={[styles.subLabel, { color: colors.textSecondary }]}>SYNCING_OPTICS...</Text>
              </View>
            </View>
          )}

          {/* Exterior Brackets */}
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
        </View>
      </Pressable>

      {image && !uploaded && !hideUploadActions && (
        <View style={styles.actionRow}>
          <PrimaryButton
            title="CONFIRM_ARTIFACT"
            loading={loading}
            onPress={onUpload || (() => { })}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  pressable: {
    padding: 10,
  },
  mainWrapper: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderWidth: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 5,
  },
  techOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 1,
  },
  statusText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: MONO,
    fontWeight: '900',
  },
  dataReadout: {
    alignSelf: 'flex-end',
  },
  readoutText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 7,
    fontFamily: MONO,
    textAlign: 'right',
    lineHeight: 10,
  },
  viewfinderCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -7,
    marginLeft: -7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLine: {
    position: 'absolute',
  },
  bracket: {
    position: 'absolute',
    width: 18,
    height: 18,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  placeholderIcon: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 35,
    borderWidth: 1,
  },
  placeholderText: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subLabel: {
    fontSize: 8,
    fontFamily: MONO,
    opacity: 0.4,
  },
  actionRow: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 10,
  }
})
