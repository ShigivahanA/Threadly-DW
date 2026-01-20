import { View, Text, StyleSheet, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { typography } from '../../src/theme/typography'
import Field from '../../src/components/auth/Field'
import PrimaryButton from '../../src/components/auth/PrimaryButton'
import { register } from '../../src/services/authService'
import SecureInput from '@/src/components/auth/SecureInput'
import { useToast } from '@/src/components/Toast/ToastProvider'

export default function Register() {
  const toast = useToast()
  const fadeHeader = useSharedValue(0)
  const fadeForm = useSharedValue(0)
  const fadeFooter = useSharedValue(0)
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.show('All fields are required', 'error')
      return
    }

    try {
      setLoading(true)

      await register({ name, email, password })
      toast.show('Account created successfully', 'success')

      // ✅ Auto-login success
      router.replace('/(tabs)/wardrobe')
    } catch (e: any) {
      toast.show(
        e?.message || 'Registration failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fadeHeader.value = withTiming(1, { duration: 400 })
    fadeForm.value = withTiming(1, { duration: 480 })
    fadeFooter.value = withTiming(1, { duration: 520 })
  }, [])


  const headerStyle = useAnimatedStyle(() => ({
    opacity: fadeHeader.value,
    transform: [{ translateY: (1 - fadeHeader.value) * 8 }],
  }))

  const formStyle = useAnimatedStyle(() => ({
    opacity: fadeForm.value,
    transform: [{ translateY: (1 - fadeForm.value) * 8 }],
  }))

  const footerStyle = useAnimatedStyle(() => ({
    opacity: fadeFooter.value,
    transform: [{ translateY: (1 - fadeFooter.value) * 8 }],
  }))


  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <View style={styles.screen}>

        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Create account
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            A calm space for your wardrobe
          </Text>
        </Animated.View>


        {/* Form */}
        <Animated.View style={[styles.form, formStyle]}>
          <Field
            label="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

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


          <PrimaryButton
            title="Create account"
            loading={loading}
            onPress={handleRegister}
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View style={footerStyle}>
          <Link href="/(auth)/login" style={styles.footer}>
            <Text style={{ color: colors.textSecondary }}>
              Already have an account? Log in →
            </Text>
          </Link>
        </Animated.View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  screen: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  title: {
    ...typography.title,
  },

  subtitle: {
    marginTop: spacing.xs,
    ...typography.subtitle,
    textAlign: 'center',
  },

  form: {
    width: '100%',
  },

  footer: {
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
})
