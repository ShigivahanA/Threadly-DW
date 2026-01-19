import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
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

import {
  login,
  requestOtp,
  verifyOtp,
} from '../../src/services/authService'

const TAB_WIDTH = 140

export default function Login() {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

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
      Alert.alert('Missing details', 'Enter email and password')
      return
    }

    try {
      setLoading(true)
      await login({ email, password })
      router.replace('/(tabs)/wardrobe')
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  /* ======================
     OTP flow
  ====================== */
  const handleOtpRequest = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Enter your email')
      return
    }

    try {
      setLoading(true)
      await requestOtp(email)
      setStep('verify')
    } catch {
      Alert.alert('Failed', 'Could not send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    if (otp.length !== 6) return false

    try {
      setLoading(true)
      await verifyOtp({ email, otp })
      router.replace('/(tabs)/wardrobe')
      return true
    } catch {
      setOtpError(true)
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <View style={styles.screen}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Login to your wardrobe
          </Text>
        </View>

        {/* Tabs */}
        <View
          style={[
            styles.tabs,
            { backgroundColor: colors.surface, borderColor: colors.border },
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
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            editable={!loading && step === 'email'}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {mode === 'password' && (
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
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
        </View>

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
