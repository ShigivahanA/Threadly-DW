import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { normalize } from '@/src/utils/responsive'
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

import wardrobeService from '@/src/services/wardrobeService'
import ImageStage from '@/src/components/upload/ImageStage'
import MetadataForm from '@/src/components/upload/MetadataForm'
import ExtractedColors from '@/src/components/upload/ExtractedColors'
import ManualColorPicker from '@/src/components/upload/ManualColorPicker'
import PrimaryButton from '@/src/components/auth/PrimaryButton'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

const TAB_BAR_HEIGHT = 64

export default function EditWardrobeItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const toast = useToast()

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true

    const load = async () => {
      try {
        const data = await wardrobeService.getItemById(id)
        if (mounted) setItem(data)
      } catch {
        toast.show('Artifact not found', 'error')
        router.back()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [id])

  const handleDelete = async () => {
    if (deleting) return
    setDeleting(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      await wardrobeService.deleteItem(id!)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Artifact purged', 'success')
      router.replace('/(tabs)/wardrobe')
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show('Purge failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)

    try {
      await wardrobeService.updateItem(id!, item)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Database updated', 'success')
      router.replace('/(tabs)/wardrobe')
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show('Sync failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.skeleton, { backgroundColor: colors.background }]}>
        <View style={[styles.skeletonCard, { backgroundColor: colors.surface }]} />
        <View style={[styles.skeletonCard, { height: 300, backgroundColor: colors.surface }]} />
      </View>
    )
  }

  if (!item) return null

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.container,
            { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 32 }
          ]}
        >
          {/* --- Header --- */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync()
                  router.back()
                }}
                hitSlop={12}
                style={[styles.backBtn, { borderColor: colors.border }]}
              >
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </Pressable>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>ANALYSIS</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                     // ARTIFACT_ID: {id?.slice(-8).toUpperCase()}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* --- Image Module --- */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// SOURCE_MEDIA</Text>
            <View style={[styles.module, { borderColor: colors.border, backgroundColor: colors.surface, padding: 8 }]}>
              <View style={styles.imageWrap}>
                <ImageStage
                  image={item.imageUrl}
                  uploaded={{ url: item.imageUrl, publicId: '' }}
                  loading={saving}
                  hideUploadActions
                />
              </View>
            </View>
          </Animated.View>

          {/* --- Color Module --- */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ marginTop: 32 }}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// COLOR_SPECTRUM</Text>
            <View style={[styles.module, { borderColor: colors.border, padding: 16, gap: 16 }]}>
              <ExtractedColors
                colors={item.colors ?? []}
                onRemove={(color) => setItem({
                  ...item,
                  colors: item.colors.filter((c: string) => c !== color),
                })}
                onManualPick={() => setShowColorPicker(true)}
              />

              {showColorPicker && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <ManualColorPicker
                    selected={item.colors ?? []}
                    onClose={() => setShowColorPicker(false)}
                    onSelect={(color) => {
                      setItem((prev: any) => ({
                        ...prev,
                        colors: prev.colors.includes(color)
                          ? prev.colors.filter((c: string) => c !== color)
                          : [...prev.colors, color],
                      }))
                    }}
                  />
                </Animated.View>
              )}
            </View>
          </Animated.View>

          {/* --- Metadata Module --- */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ marginTop: 32 }}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// ARTIFACT_DATA</Text>
            <View style={[styles.module, { borderColor: colors.border, padding: 16 }]}>
              <MetadataForm meta={item} setMeta={setItem} />

              <View style={styles.actions}>
                <PrimaryButton
                  title="UPDATE_ARCHIVE"
                  loading={saving}
                  onPress={handleSave}
                />

                <Pressable
                  onPress={handleDelete}
                  disabled={deleting}
                  style={({ pressed }) => [
                    styles.deleteBtn,
                    {
                      borderColor: colors.error,
                      backgroundColor: pressed ? colors.error : 'transparent',
                      opacity: deleting ? 0.5 : 1
                    }
                  ]}
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color={colors.error} />
                  ) : (
                    <Text style={[styles.deleteBtnText, { color: colors.error }]}>DECONSTRUCT</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(28),
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  module: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  deleteBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: normalize(10),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '900',
    letterSpacing: 1,
  },
  skeleton: {
    flex: 1,
    padding: spacing.xl,
    gap: 20,
    justifyContent: 'center',
  },
  skeletonCard: {
    height: 200,
    borderRadius: 24,
  }
})

