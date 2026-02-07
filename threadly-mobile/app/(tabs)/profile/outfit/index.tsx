import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { BlurView } from 'expo-blur'
import { normalize } from '@/src/utils/responsive'

import OutfitItemCard from '@/src/components/outfit/OutfitItemCard'
import outfitService from '@/src/services/outfitService'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { useToast } from '@/src/components/Toast/ToastProvider'
import PrimaryButton from '@/src/components/auth/PrimaryButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.6
const TAB_BAR_HEIGHT = 64

export default function OutfitScreen() {
  const toast = useToast()
  const params = useLocalSearchParams<any>()
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  // Parse items
  const top = params.top ? JSON.parse(params.top) : null
  const bottom = params.bottom ? JSON.parse(params.bottom) : null
  const shoe = params.shoe ? JSON.parse(params.shoe) : null

  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  if (!top || !bottom || !shoe) return null;

  const handleSave = async () => {
    if (!occasion.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show('Please tag an occasion', 'error')
      return
    }

    setSaving(true)
    try {
      await outfitService.createOutfit({
        items: { top: top._id, bottom: bottom._id, footwear: shoe._id },
        occasion,
        notes,
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Look archived successfully', 'success')
      router.replace('/(tabs)/profile/saved-outfits')
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show(err?.message || 'Failed to archive', 'error')
      setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + spacing.xl,
        }}
      >
        {/* --- Header --- */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>BLUEPRINT</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>// NEW_ASSEMBLY</Text>
        </Animated.View>

        {/* --- Visual Staging Area --- */}
        <View style={styles.stage}>
          {/* The Thread Line */}
          <View style={[styles.threadLine, { borderColor: colors.border }]} />

          {/* Items Staggered */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.itemWrapper, { alignSelf: 'flex-start', marginLeft: spacing.lg }]}>
            <OutfitItemCard item={top} width={CARD_WIDTH} />
            <View style={[styles.connector, { right: -20, borderColor: colors.border }]} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.itemWrapper, { alignSelf: 'flex-end', marginRight: spacing.lg, marginTop: -40 }]}>
            <OutfitItemCard item={bottom} width={CARD_WIDTH} />
            <View style={[styles.connector, { left: -20, borderColor: colors.border }]} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.itemWrapper, { alignSelf: 'center', marginTop: -40 }]}>
            <OutfitItemCard item={shoe} width={CARD_WIDTH} />
          </Animated.View>
        </View>


        {/* --- Meta Data Form --- */}
        <BlurView
          intensity={theme === 'dark' ? 50 : 80}
          tint={theme === 'dark' ? 'dark' : 'light'}
          style={[styles.formSection, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
        >
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>OCCASION</Text>
            <TextInput
              value={occasion}
              onChangeText={setOccasion}
              placeholder="e.g. Gallery Opening"
              placeholderTextColor={colors.textSecondary + '80'}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>NOTES</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="// Add styling notes..."
              placeholderTextColor={colors.textSecondary + '80'}
              multiline
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, minHeight: 60 }]}
            />
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              title={saving ? "ARCHIVING..." : "ARCHIVE LOOK"}
              onPress={handleSave}
              loading={saving}
            />

            <Pressable onPress={() => router.back()} style={{ padding: 12 }}>
              <Text style={[styles.discard, { color: colors.textSecondary }]}>DISCARD DRAFT</Text>
            </Pressable>
          </View>
        </BlurView>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 4,
  },
  title: {
    fontSize: normalize(28),
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: normalize(11),
    fontFamily: 'Courier',
    opacity: 0.6,
  },
  stage: {
    position: 'relative',
    marginBottom: 40,
    minHeight: 400,
  },
  threadLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  itemWrapper: {
    marginBottom: 0,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  connector: {
    position: 'absolute',
    top: '50%',
    width: 20,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  formSection: {
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    fontSize: normalize(15),
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontFamily: 'Courier', // Tech mono input
  },
  actions: {
    marginTop: 12,
    gap: 4,
    alignItems: 'center',
  },
  discard: {
    fontSize: normalize(10),
    fontWeight: '600',
    letterSpacing: 1,
  }
})
