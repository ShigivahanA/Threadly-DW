import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Dimensions, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import { useTheme } from '@/src/theme/ThemeProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { normalize } from '@/src/utils/responsive'
import { FONTS } from '@/src/theme/fonts'

import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { register } from '../../src/services/authService'
import SecureInput from '@/src/components/auth/SecureInput'

const MONO = FONTS.mono

/* ====================================================================
   COMPONENTS
   ==================================================================== */

const ModernInput = ({ label, ...props }: any) => {
  const { theme } = useTheme()
  const bgColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
  const textColor = theme === 'dark' ? '#fff' : '#000'
  const placeholderColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[styles.label, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>
        // {label.toUpperCase()}
      </Text>
      <TextInput
        placeholderTextColor={placeholderColor}
        style={[
          styles.modernInput,
          { backgroundColor: bgColor, color: textColor },
        ]}
        {...props}
      />
    </View>
  )
}

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

const CircleButton = ({ onPress, loading }: { onPress: () => void; loading: boolean }) => {
  const { theme } = useTheme()
  const scale = useSharedValue(1)
  const bg = theme === 'dark' ? '#fff' : '#000'
  const iconColor = theme === 'dark' ? '#000' : '#fff'

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150, easing: Easing.inOut(Easing.ease) })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
  }

  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); onPress() }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
    >
      <Animated.View style={[styles.circleButton, { backgroundColor: bg }, animatedStyle]}>
        {loading ? (
          <Spinner color={iconColor} />
        ) : (
          <Ionicons name="arrow-forward" size={28} color={iconColor} />
        )}
      </Animated.View>
    </Pressable>
  )
}

/* ====================================================================
   MAIN COMPONENT
   ==================================================================== */

export default function Register() {
  const toast = useToast()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Subtle Background Animation
  const blob1X = useSharedValue(0)
  const blob2Y = useSharedValue(0)

  useEffect(() => {
    blob1X.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 12000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 12000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    )
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 15000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    )
  }, [])

  const blob1Style = useAnimatedStyle(() => ({ transform: [{ translateX: blob1X.value }, { translateY: blob1X.value }] }))
  const blob2Style = useAnimatedStyle(() => ({ transform: [{ translateY: blob2Y.value }, { translateX: -blob2Y.value }] }))

  // Handlers
  const handleRegister = async () => {
    if (!name || !email || !password) return toast.show('Fill all fields', 'error')

    try {
      setLoading(true)
      await register({ name, email, password })
      toast.show('Account created', 'success')
      router.replace('/(tabs)/wardrobe')
    } catch (e: any) {
      toast.show(e?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Card Background Logic
  const androidOuterBg = theme === 'dark' ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)'
  const iosOuterBg = theme === 'dark' ? 'rgba(20,20,20,0.6)' : 'rgba(255,255,255,0.8)'

  const androidInnerBg = theme === 'dark' ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)'
  const iosInnerBg = theme === 'dark' ? 'rgba(20,20,20,0.5)' : 'rgba(255,255,255,0.6)'

  const Bracket = ({ style }: { style: any }) => (
    <View style={[styles.bracket, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }, style]} />
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 
         BACKGROUND BLOBS
      */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#059669' : '#6ee7b7', // Emeralds
            top: -120,
            left: -50,
            width: 380,
            height: 380,
            opacity: 0.1,
          },
          blob1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: theme === 'dark' ? '#0891b2' : '#67e8f9', // Cyans
            bottom: -80,
            right: -100,
            width: 420,
            height: 420,
            opacity: 0.12,
          },
          blob2Style,
        ]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <View style={styles.content}>

            {/* LARGE TITLE */}
            <View style={styles.titleContainer}>
              <Animated.Text entering={FadeInDown.duration(800).easing(Easing.out(Easing.quad))} style={[styles.bigTitle, { color: colors.textPrimary }]}>
                NEW
              </Animated.Text>
              <Animated.Text entering={FadeInDown.duration(800).delay(100).easing(Easing.out(Easing.quad))} style={[styles.bigTitle, { color: colors.textPrimary, lineHeight: normalize(60) }]}>
                USER.
              </Animated.Text>
            </View>

            {/* THE GLASS CARD */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(800).easing(Easing.out(Easing.quad))}
              style={[
                styles.cardContainer,
                {
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderWidth: 1,
                  backgroundColor: Platform.OS === 'android' ? androidOuterBg : iosOuterBg,
                }
              ]}
            >
              <BlurView intensity={Platform.OS === 'ios' ? 40 : 0} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.glassCard}>

                {/* Inner tint layer - visible on iOS only */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: Platform.OS === 'android' ? androidInnerBg : iosInnerBg, zIndex: -1 }]} />
                {/* Technical Brackets */}
                <Bracket style={{ top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 }} />
                <Bracket style={{ bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 }} />
                <Bracket style={{ bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 }} />

                {/* FORM AREA */}
                <View style={styles.inputGroup}>
                  <ModernInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholder="Jane Doe"
                  />

                  <ModernInput
                    label="Identity (Email)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="hello@example.com"
                  />

                  <View style={{ marginBottom: spacing.md }}>
                    <Text style={[styles.label, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>// PASSWORD</Text>
                    <SecureInput
                      value={password}
                      onChangeText={setPassword}
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        borderWidth: 0,
                        borderRadius: 12,
                        color: colors.textPrimary,
                        fontFamily: MONO
                      }}
                      placeholder=""
                    />
                  </View>
                </View>

                {/* ACTION ROW */}
                <View style={[styles.actionRow, { borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                      INITIALIZE_WARDROBE_PROTOCOL
                    </Text>
                  </View>
                  <CircleButton loading={loading} onPress={handleRegister} />
                </View>

              </BlurView>
            </Animated.View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Link href="/(auth)/login">
                <Text style={{ color: colors.textSecondary, fontSize: normalize(12), fontFamily: MONO }}>
                  IDENTIFIED? <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>RESTORE_SESSION</Text>
                </Text>
              </Link>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    zIndex: 10,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  titleContainer: {
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
  },
  bigTitle: {
    fontSize: normalize(52),
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: -2,
  },
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  glassCard: {
    padding: spacing.xl,
    paddingVertical: 32,
    position: 'relative'
  },
  inputGroup: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modernInput: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: normalize(14),
    fontFamily: MONO,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  welcomeText: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '500',
    letterSpacing: 1,
    lineHeight: 20,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl * 1.5,
  },
  bracket: {
    position: 'absolute',
    width: 16,
    height: 16,
    opacity: 0.5,
  }
})
