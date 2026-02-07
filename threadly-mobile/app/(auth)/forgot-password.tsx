import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native'
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { normalize } from '@/src/utils/responsive'

import { useTheme } from '@/src/theme/ThemeProvider'
import { requestPasswordReset } from '@/src/services/authService'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { FONTS } from '@/src/theme/fonts'

const { width } = Dimensions.get('window')
const MONO = FONTS.mono

const Spinner = ({ color }: { color: string }) => {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 24,
          height: 24,
          borderWidth: 2,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRadius: 12
        }
      ]}
    />
  )
}

export default function ForgotPassword() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Ambient Blobs
  const blob1Y = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 6000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.quad) })
      ), -1, true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob1Y.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }] }))

  const handleReset = async () => {
    if (!email) {
      toast.show('Enter credentials', 'error')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset(email)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Reset sequence initiated', 'success')
      // Optional: Navigate back after success
      setTimeout(() => router.back(), 2000)
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.show(e.message || 'Sequence failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const bgColor = theme === 'dark' ? '#000' : '#fff'
  const textColor = theme === 'dark' ? '#fff' : '#000'
  const glassBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  const glassTint = theme === 'dark' ? 'dark' : 'light'

  // Card Background Logic
  const androidOuterBg = theme === 'dark' ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)'
  const iosOuterBg = theme === 'dark' ? 'rgba(20,20,20,0.6)' : 'rgba(255,255,255,0.8)'

  const Bracket = ({ style }: { style: any }) => (
    <View style={[styles.bracket, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }, style]} />
  )

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      {/* BACKGROUND BLOBS */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#7e22ce' : '#d8b4fe',
            top: -100, right: -100, width: 400, height: 400, opacity: 0.15,
          },
          blob1Style
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#be123c' : '#fda4af',
            bottom: -50, left: -100, width: 350, height: 350, opacity: 0.15,
          },
          blob2Style
        ]}
      />

      <Animated.View
        style={[styles.header, { paddingTop: insets.top + 20 }]}
        entering={FadeInDown.delay(100).springify()}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <Text style={[styles.title, { color: textColor }]}>
            RESET_ACCESS
          </Text>
          <Text style={[styles.subtitle, { color: theme === 'dark' ? '#a1a1aa' : '#52525b' }]}>
            // ENTER_ASSOCIATED_ID_TO_INITIATE_PASSWORD_RECOVERY_PROTOCOL
          </Text>

          {/* GLASS FORM CONTAINER */}
          <View style={[
            styles.glassContainer,
            {
              borderColor: glassBorder,
              backgroundColor: Platform.OS === 'android' ? androidOuterBg : iosOuterBg
            }
          ]}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 40 : 0}
              tint={glassTint}
              style={[styles.blurContent, Platform.OS === 'android' && { backgroundColor: androidOuterBg }]}
            >

              {/* Technical Brackets */}
              <Bracket style={{ top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 }} />
              <Bracket style={{ top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 }} />
              <Bracket style={{ bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 }} />
              <Bracket style={{ bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 }} />

              <View style={{ gap: 8 }}>
                <Text style={[styles.label, { color: theme === 'dark' ? '#ccc' : '#444' }]}>// IDENTITY_EMAIL</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="user@example.com"
                  placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                  style={[
                    styles.input,
                    {
                      color: textColor,
                      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                      borderColor: glassBorder
                    }
                  ]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <Pressable
                onPress={handleReset}
                disabled={loading}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: theme === 'dark' ? '#fff' : '#000',
                    opacity: pressed || loading ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                  }
                ]}
              >
                {loading ? (
                  <Spinner color={theme === 'dark' ? '#000' : '#fff'} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme === 'dark' ? '#000' : '#fff' }]}>EXECUTE_RESET_LINK</Text>
                )}
              </Pressable>

            </BlurView>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  header: {
    paddingHorizontal: 24,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(125,125,125,0.1)',
  },
  title: {
    fontSize: normalize(28),
    fontFamily: MONO,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: normalize(10),
    fontFamily: MONO,
    lineHeight: 18,
    marginBottom: 40,
    opacity: 0.8,
  },
  glassContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blurContent: {
    padding: 24,
    gap: 24,
    position: 'relative'
  },
  label: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '700',
    marginBottom: 4,
    opacity: 0.8,
    letterSpacing: 1,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: normalize(14),
    fontFamily: MONO,
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: normalize(12),
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bracket: {
    position: 'absolute',
    width: 16,
    height: 16,
    opacity: 0.5,
  }
})
