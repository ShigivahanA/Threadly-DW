import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Pressable } from 'react-native'
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
import { typography } from '@/src/theme/typography'

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

  /* ======================
     Load item
  ====================== */
  useEffect(() => {
    if (!id) return

    let mounted = true

    const load = async () => {
      try {
        const data = await wardrobeService.getItemById(id)
        if (mounted) setItem(data)
      } catch {
        toast.show('Item not found', 'error')
        router.back()
      } finally {
        mounted && setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [id])

  /* ======================
     Skeleton (inline)
  ====================== */
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.xl,
        }}
      >
        <View
          style={{
            height: 240,
            borderRadius: 20,
            backgroundColor: colors.surface,
            marginBottom: spacing.lg,
          }}
        />
        <View
          style={{
            height: 180,
            borderRadius: 20,
            backgroundColor: colors.surface,
          }}
        />
      </View>
    )
  }

  if (!item) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textSecondary }}>
          Item not found
        </Text>
      </View>
    )
  }
  const handleDelete = async () => {
  if (deleting) return

  setDeleting(true)
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

  try {
    await wardrobeService.deleteItem(id!)

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    toast.show('Item deleted', 'success')

    // ⬅️ IMPORTANT: replace instead of back
    router.replace('/(tabs)/wardrobe')
  } catch {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    toast.show('Failed to delete item', 'error')
  } finally {
    setDeleting(false)
  }
}


  /* ======================
     Save
  ====================== */
  const handleSave = async () => {
  if (saving) return

  setSaving(true)

  try {
    await wardrobeService.updateItem(id!, item)

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    toast.show('Changes saved', 'success')

    router.replace('/(tabs)/wardrobe')
  } catch {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    toast.show('Failed to save changes', 'error')
  } finally {
    setSaving(false)
  }
}

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom:
            spacing.xl + insets.bottom + TAB_BAR_HEIGHT,
        }}
      >
        <Animated.View entering={FadeInUp.duration(400)} style={styles.wrap}>
  {/* Top row */}
  <View style={styles.row}>
    <Pressable
      onPress={async () => {
        await Haptics.selectionAsync()
        router.back()
      }}
      hitSlop={8}
      style={styles.back}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color={colors.textPrimary}
      />
    </Pressable>

    <Text style={[styles.title, { color: colors.textPrimary }]}>
      Edit wardrobe item
    </Text>
  </View>

  {/* Subtitle */}
  <Text
    style={[
      styles.sub,
      {
        color: colors.textSecondary,
        opacity: theme === 'dark' ? 0.9 : 0.75,
      },
    ]}
  >
    Update details for this item
  </Text>
</Animated.View>



        {/* Image */}
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
              image={item.imageUrl}
              uploaded={{ url: item.imageUrl }}
              loading={saving}
              hideUploadActions
            />
          </View>
        </Animated.View>

        {/* Colors */}
        <View style={styles.colorsSection}>
          <ExtractedColors
            colors={item.colors ?? []}
            onRemove={(color) =>
              setItem({
                ...item,
                colors: item.colors.filter((c: string) => c !== color),
              })
            }
            onManualPick={() => setShowColorPicker(true)}
          />

          {showColorPicker && (
            <ManualColorPicker
              selected={item.colors ?? []}
              onSelect={(color) => {
                setItem((prev: any) => ({
                  ...prev,
                  colors: prev.colors.includes(color)
                    ? prev.colors.filter((c: string) => c !== color)
                    : [...prev.colors, color],
                }))
              }}
            />
          )}
        </View>

        {/* Metadata */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <MetadataForm meta={item} setMeta={setItem} />

          <View style={styles.actions}>
  <PrimaryButton
    title="Delete item"
    onPress={handleDelete}
    variant="danger"
    loading={deleting}
  />

  <PrimaryButton
    title="Save changes"
    loading={saving}
    onPress={handleSave}
  />
</View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  heroCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
},

  colorsSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  card: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.lg,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
  gap: spacing.md,
},

wrap: {
  gap: 4,
},

row: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
},

back: {
  padding: 4, // no forced height
},

title: {
  fontSize: 22,
  fontWeight: '600',
  letterSpacing: -0.3,
},

sub: {
  fontSize: 13,
  marginLeft: 26, // aligns under title, not arrow
},

})
