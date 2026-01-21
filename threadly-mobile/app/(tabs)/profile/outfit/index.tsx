import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OutfitItemCard from '@/src/components/outfit/OutfitItemCard'
import outfitService from '@/src/services/outfitService'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { ActivityIndicator } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useToast } from '@/src/components/Toast/ToastProvider'


const TAB_BAR_HEIGHT = 64 // 👈 CRITICAL for Android

export default function OutfitScreen() {
  const toast = useToast()
  const params = useLocalSearchParams<any>()

  const top = params.top ? JSON.parse(params.top) : null
  const bottom = params.bottom ? JSON.parse(params.bottom) : null
  const shoe = params.shoe ? JSON.parse(params.shoe) : null

  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [showSave, setShowSave] = useState(false)
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  if (!top || !bottom || !shoe) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.textSecondary }}>
          No outfit selected
        </Text>
      </View>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  const handleSave = async () => {
  if (!occasion.trim()) {
    toast.show('Please add an occasion', 'error')
    return
  }

  setSaving(true)

  try {
    await outfitService.createOutfit({
      items: {
        top: top._id,
        bottom: bottom._id,
        footwear: shoe._id,
      },
      occasion,
      notes,
    })

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    toast.show('Outfit saved successfully', 'success')

    router.replace('/(tabs)/profile/saved-outfits')
  } catch (err: any) {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )

    toast.show(
      err?.message || 'Failed to save outfit',
      'error'
    )

    setSaving(false)
  }
}


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        backgroundColor: colors.background,
        paddingTop: insets.top + spacing.lg,
        paddingBottom:
          insets.bottom + TAB_BAR_HEIGHT + spacing.xl, // ✅ FIX
        paddingHorizontal: spacing.xl,
        flexGrow: 1, // ✅ REQUIRED
      }}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Your Outfit
      </Text>

      {/* Outfit preview */}
      <View style={styles.preview}>
        <OutfitItemCard item={top} />
        <OutfitItemCard item={bottom} />
        <OutfitItemCard item={shoe} />
      </View>

      {/* Save section */}
      {showSave && (
        <View
          style={[
            styles.saveSection,
            { borderColor: colors.border },
          ]}
        >
          <TextInput
            value={occasion}
            onChangeText={setOccasion}
            placeholder="Where are you wearing this?"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
          />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={colors.textSecondary}
            multiline
            style={[
              styles.textarea,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
          />

          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            Date: {today} · Wear count starts at 1
          </Text>

          <Pressable
  disabled={saving}
  onPress={handleSave}
  style={[
    styles.primaryButton,
    {
      backgroundColor: colors.textPrimary,
      opacity: saving ? 0.6 : 1,
    },
  ]}
>
  {saving ? (
    <ActivityIndicator
      size="small"
      color={colors.background}
    />
  ) : (
    <Text
      style={[
        styles.primaryButtonText,
        { color: colors.background },
      ]}
    >
      Save Outfit
    </Text>
  )}
</Pressable>

        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {!showSave && (
          <Pressable onPress={() => setShowSave(true)}>
            <Text style={{ color: colors.textSecondary }}>
              Save this outfit
            </Text>
          </Pressable>
        )}

        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.textSecondary }}>
            Choose again
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  preview: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  saveSection: {
    borderTopWidth: 1,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 14,
    minHeight: 80,
  },
  meta: {
    fontSize: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    marginTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
