import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  Layout
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '@/src/theme/ThemeProvider'
import { useToast } from '@/src/components/Toast/ToastProvider'
import contactService from '@/src/services/contactService'
import { spacing } from '@/src/theme/spacing'
import { lightColors, darkColors } from '@/src/theme/colors'
import { normalize } from '@/src/utils/responsive'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const MONO = Platform.OS === 'ios' ? 'Courier' : 'monospace'

// --- Components ---

const Spinner = ({ color }: { color: string }) => {
  const rotation = useSharedValue(0)
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }), -1
    )
  }, [])
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }))
  return (
    <Animated.View style={[animatedStyle, { width: 20, height: 20, borderWidth: 2, borderColor: color, borderTopColor: 'transparent', borderRadius: 10 }]} />
  )
}

const TechnicalInput = ({ label, multiline, ...props }: any) => {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.inputHeader}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          // {label.toUpperCase()}
        </Text>
        <Text style={[styles.inputMeta, { color: colors.textSecondary, opacity: 0.3 }]}>[REQ_SECURE]</Text>
      </View>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
        style={[
          styles.input,
          {
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderColor: colors.border,
            color: colors.textPrimary,
            height: multiline ? 120 : 56,
            paddingTop: multiline ? 16 : 0,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
      />
    </View>
  )
}

// --- Main Screen ---

export default function ContactScreen() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const toast = useToast()
  const router = useRouter()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.email || !form.message) return toast.show('Email and message required', 'error')

    setSending(true)
    try {
      await contactService.sendMessage(form)
      setForm({ name: '', email: '', message: '' })
      setSent(true)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show(e?.message || 'Failed to send', 'error')
    } finally {
      setSending(false)
    }
  }

  const CornerBracket = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const isTop = position.startsWith('t')
    const isLeft = position.endsWith('l')
    return (
      <View style={[
        styles.bracket,
        { borderColor: colors.textPrimary, opacity: 0.2 },
        isTop ? { top: 0, borderTopWidth: 1 } : { bottom: 0, borderBottomWidth: 1 },
        isLeft ? { left: 0, borderLeftWidth: 1 } : { right: 0, borderRightWidth: 1 }
      ]} />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: 60 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={[styles.backBtn, { borderColor: colors.border }]}
                hitSlop={15}
              >
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              </Pressable>

              <Animated.View entering={FadeInDown.duration(800)}>
                <Text style={[styles.bigTitle, { color: colors.textPrimary }]}>
                  CONTACT_US
                </Text>
                <View style={styles.subtitleRow}>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    // ESTABLISHING_UPLINK
                  </Text>
                  <View style={[styles.blinkDot, { backgroundColor: colors.accent }]} />
                </View>
              </Animated.View>
            </View>

            {/* Technical Form Container */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(800)}
              style={[styles.formCard, { borderColor: colors.border, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardHeaderText, { color: colors.textSecondary }]}>// [SECURE_TRANSMISSION_PROTOCOL]</Text>
              </View>

              <View style={styles.cardBody}>
                {sent ? (
                  <Animated.View entering={FadeIn.duration(400)} style={styles.successState}>
                    <View style={styles.successIconOuter}>
                      <View style={[styles.successIconInner, { backgroundColor: colors.textPrimary }]}>
                        <Ionicons name="checkmark" size={36} color={colors.background} />
                      </View>
                      <View style={[styles.pulseCircle, { borderColor: colors.textPrimary, opacity: 0.2 }]} />
                    </View>

                    <Text style={[styles.successTitle, { color: colors.textPrimary }]}>MESSAGE_ACCEPTED</Text>
                    <Text style={[styles.successText, { color: colors.textSecondary }]}>
                      Transmission successful. Our systems will process your inquiry and dispatch a response shortly.
                    </Text>

                    <Pressable onPress={() => setSent(false)} style={styles.resetBtn}>
                      <Text style={[styles.resetText, { color: colors.accent }]}>RESET_SEQUENCE</Text>
                    </Pressable>
                  </Animated.View>
                ) : (
                  <View>
                    <TechnicalInput label="Subject_Identity" value={form.name} onChangeText={(t: string) => update('name', t)} placeholder="ENTER_NAME" />
                    <TechnicalInput label="Direct_Uplink" value={form.email} onChangeText={(t: string) => update('email', t)} placeholder="USER@DOMAIN.SYS" keyboardType="email-address" />
                    <TechnicalInput label="Data_Payload" value={form.message} onChangeText={(t: string) => update('message', t)} placeholder="INITIALIZE_MESSAGE_CONTENT..." multiline />

                    <Pressable
                      onPress={handleSubmit}
                      disabled={sending}
                      style={({ pressed }) => [
                        styles.sendBtn,
                        {
                          backgroundColor: colors.textPrimary,
                          opacity: pressed || sending ? 0.9 : 1,
                        }
                      ]}
                    >
                      {sending ? (
                        <Spinner color={colors.background} />
                      ) : (
                        <Text style={[styles.sendBtnText, { color: colors.background }]}>EXECUTE_SEND</Text>
                      )}
                    </Pressable>
                  </View>
                )}
              </View>

              <CornerBracket position="tl" />
              <CornerBracket position="tr" />
              <CornerBracket position="bl" />
              <CornerBracket position="br" />
            </Animated.View>

            {/* Footer Metadata */}
            <View style={styles.footerMeta}>
              <Text style={[styles.metaReadout, { color: colors.textSecondary }]}>
                SYST: CLOUD_SYNC_ACTIVE
              </Text>
              <Text style={[styles.metaReadout, { color: colors.textSecondary }]}>
                ENCR: RSA_4096_GCM
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: 40,
    gap: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigTitle: {
    fontSize: normalize(42),
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: normalize(44),
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  subtitle: {
    fontSize: normalize(11),
    fontFamily: MONO,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  blinkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 4, // Technical sharp look
    position: 'relative',
    padding: 1,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeaderText: {
    fontSize: normalize(9),
    fontFamily: MONO,
    fontWeight: '700',
  },
  cardBody: {
    padding: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '700',
  },
  inputMeta: {
    fontSize: normalize(8),
    fontFamily: MONO,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: normalize(14),
    fontFamily: MONO,
  },
  sendBtn: {
    height: 56,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  sendBtnText: {
    fontSize: normalize(13),
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bracket: {
    position: 'absolute',
    width: 16,
    height: 16,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 20,
  },
  successIconOuter: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  successIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pulseCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 1,
  },
  successTitle: {
    fontSize: normalize(18),
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: 2,
  },
  successText: {
    fontSize: normalize(12),
    fontFamily: MONO,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
  resetBtn: {
    marginTop: 12,
  },
  resetText: {
    fontSize: normalize(11),
    fontFamily: MONO,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footerMeta: {
    marginTop: 40,
    gap: 8,
    alignItems: 'center',
  },
  metaReadout: {
    fontSize: normalize(9),
    fontFamily: MONO,
    opacity: 0.4,
  }
})
