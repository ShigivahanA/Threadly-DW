import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import ContactHeader from '@/src/components/Contact/ContactHeader'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

import PrimaryButton from '@/src/components/auth/PrimaryButton'
import { useToast } from '@/src/components/Toast/ToastProvider'
import contactService from '@/src/services/contactService'

type InputProps = {
  colors: typeof lightColors
  value?: string
  placeholder?: string
  onChangeText?: (text: string) => void
} & React.ComponentProps<typeof TextInput>


export default function ContactScreen() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const toast = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.email || !form.message) {
      toast.show('Email and message are required', 'error')
      return
    }

    setSending(true)

    try {
      await contactService.sendMessage(form)

      setForm({ name: '', email: '', message: '' })
      setSent(true)

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )

      toast.show(
        'Message received. We’ll reply thoughtfully.',
        'success'
      )
    } catch (e: any) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      )

      toast.show(
        e?.message || 'Failed to send message',
        'error'
      )
    } finally {
      setSending(false)
    }
  }

  return (
  <SafeAreaView
    style={[
      styles.safe,
      { backgroundColor: colors.background },
    ]}
  >
    {/* 🔝 Header pinned to top */}
    <View style={styles.headerWrap}>
      <ContactHeader />
    </View>

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { flexGrow: 1, justifyContent: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!sent && (
    <Text
      style={[
        styles.formHint,
        { color: colors.textSecondary },
      ]}
    >
      We read every message carefully
    </Text>
  )}
        {sent ? (
          <View
            style={[
              styles.successBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.check,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: 18,
                  fontWeight: '600',
                }}
              >
                ✓
              </Text>
            </View>

            <Text
              style={[
                styles.successTitle,
                { color: colors.textPrimary },
              ]}
            >
              Message sent
            </Text>

            <Text
              style={[
                styles.successText,
                { color: colors.textSecondary },
              ]}
            >
              Thanks for reaching out. We’ve received your
              message and will respond with care.
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              placeholder="Your name"
              value={form.name}
              onChangeText={v => update('name', v)}
              colors={colors}
            />

            <Input
              placeholder="Email address"
              value={form.email}
              onChangeText={v => update('email', v)}
              autoCapitalize="none"
              keyboardType="email-address"
              colors={colors}
            />

            <TextInput
              value={form.message}
              onChangeText={v => update('message', v)}
              placeholder="Your message"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              style={[
                styles.textarea,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />

            <PrimaryButton
              title="Send message"
              loading={sending}
              onPress={handleSubmit}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
)
}

/* ---------------- Small input ---------------- */

function Input({ colors, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
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
  )
}


/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  content: {
    padding: spacing.xl,
    gap: spacing.xl,
  },

  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },

  form: {
    gap: spacing.md,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    minHeight: 110,
    textAlignVertical: 'top',
  },

  successBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },

  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  successText: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
  headerWrap: {
  paddingHorizontal: spacing.xl,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
},
formHint: {
  fontSize: 13,
  textAlign: 'center',
  marginBottom: spacing.md,
  opacity: 0.85,
},

})
