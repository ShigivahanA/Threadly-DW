import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { useTheme } from '@/src/theme/ThemeProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { typography } from '../../src/theme/typography'
import Field from '../../src/components/auth/Field'
import OtpInput from '../../src/components/auth/OtpInput'
import PrimaryButton from '../../src/components/auth/PrimaryButton'
import { useToast } from '@/src/components/Toast/ToastProvider'
import {
  login,
  requestOtp,
  verifyOtp,
} from '../../src/services/authService'
import SecureInput from '@/src/components/auth/SecureInput'

const TAB_WIDTH = 140

export default function Login() {
  const toast = useToast()
  const fadeHeader = useSharedValue(0)
  const fadeTabs = useSharedValue(0)
  const fadeForm = useSharedValue(0)

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [step, setStep] = useState<'email' | 'verify'>('email')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [loading, setLoading] = useState(false)

  /* ======================
     Animated tab indicator
  ====================== */
  const tabX = useSharedValue(0)

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabX.value }],
  }))

  const switchMode = (m: 'password' | 'otp') => {
    if (loading) return

    setMode(m)
    setStep('email')
    setOtp('')
    setOtpError(false)

    tabX.value = withTiming(
      m === 'password' ? 0 : TAB_WIDTH,
      { duration: 220, easing: Easing.out(Easing.cubic) }
    )
  }

  /* ======================
     Password login
  ====================== */
  const handlePasswordLogin = async () => {
    if (!email || !password) {
      toast.show('All fields are required', 'error')
      return
    }

    try {
      setLoading(true)
      await login({ email, password })
      toast.show('Logged in successfully', 'success')

      // ✅ Auto-login success
      router.replace('/(tabs)/wardrobe')
    } catch (e: any) {
      toast.show(e.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  /* ======================
     OTP flow
  ====================== */
  const handleOtpRequest = async () => {
    if (!email) {
      toast.show('Email is required', 'error')
      return
    }

    try {
      setLoading(true)
      await requestOtp(email)
      setStep('verify')
    } catch {
      toast.show('Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    if (otp.length !== 6) return false

    try {
      setLoading(true)
      await verifyOtp({ email, otp })
      toast.show('Logged in successfully', 'success')

      // ✅ Auto-login success
      router.replace('/(tabs)/wardrobe')
      return true
    } catch {
      setOtpError(true)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fadeHeader.value = withTiming(1, { duration: 400 })
    fadeTabs.value = withTiming(1, { duration: 450 })
    fadeForm.value = withTiming(1, { duration: 500 })
  }, [])

  const headerStyle = useAnimatedStyle(() => ({
    opacity: fadeHeader.value,
    transform: [{ translateY: (1 - fadeHeader.value) * 8 }],
  }))

  const tabsStyle = useAnimatedStyle(() => ({
    opacity: fadeTabs.value,
    transform: [{ translateY: (1 - fadeTabs.value) * 8 }],
  }))

  const formStyle = useAnimatedStyle(() => ({
    opacity: fadeForm.value,
    transform: [{ translateY: (1 - fadeForm.value) * 8 }],
  }))

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <View style={styles.screen}>

        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Login to your wardrobe
          </Text>
        </Animated.View>


        {/* Tabs */}
        <Animated.View
          style={[
            styles.tabs,
            { backgroundColor: colors.surface, borderColor: colors.border },
            tabsStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.indicator,
              { backgroundColor: colors.background },
              indicatorStyle,
            ]}
          />

          <Text
            onPress={() => switchMode('password')}
            style={[
              styles.tab,
              { color: mode === 'password'
                ? colors.textPrimary
                : colors.textSecondary },
            ]}
          >
            Password
          </Text>

          <Text
            onPress={() => switchMode('otp')}
            style={[
              styles.tab,
              { color: mode === 'otp'
                ? colors.textPrimary
                : colors.textSecondary },
            ]}
          >
            OTP
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.form, formStyle]}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            editable={!loading && step === 'email'}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {mode === 'password' && (
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  marginBottom: spacing.xs,
                  color: colors.textSecondary,
                  ...typography.label,
                }}
              >
                Password
              </Text>

              <SecureInput
                value={password}
                onChangeText={setPassword}
              />
            </View>
                    )}

          {mode === 'otp' && step === 'verify' && (
            <OtpInput
              value={otp}
              error={otpError}
              disabled={loading}
              onChange={(v) => {
                setOtp(v)
                setOtpError(false)
              }}
              onComplete={async () => {
                const ok = await handleOtpVerify()
                if (!ok) setOtp('')
              }}
            />
          )}

          {/* Forgot password */}
          <Link href="/(auth)/forgot-password" style={styles.forgot}>
            <Text style={{ color: colors.textSecondary }}>
              Forgot password →
            </Text>
          </Link>

          <PrimaryButton
            title={
              mode === 'password'
                ? 'Login'
                : step === 'email'
                  ? 'Send OTP'
                  : 'Verifying…'
            }
            loading={loading}
            onPress={
              mode === 'password'
                ? handlePasswordLogin
                : step === 'email'
                  ? handleOtpRequest
                  : () => {}
            }
          />
        </Animated.View>

        {/* Footer */}
        <Link href="/(auth)/register" style={styles.footer}>
          <Text style={{ color: colors.textSecondary }}>
            New user? Register →
          </Text>
        </Link>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  screen: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  title: { ...typography.title },

  subtitle: {
    marginTop: spacing.xs,
    ...typography.subtitle,
  },

  tabs: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    width: TAB_WIDTH * 2,
    alignSelf: 'center',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },

  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    borderRadius: 999,
  },

  tab: {
    width: TAB_WIDTH,
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 14,
    fontWeight: '600',
  },

  form: {
    width: '100%',
  },

  forgot: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },

  footer: {
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
})
