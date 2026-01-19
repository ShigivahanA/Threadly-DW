import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'

import Animated, {
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { typography } from '../../src/theme/typography'

import Field from '../../src/components/auth/Field'
import PrimaryButton from '../../src/components/auth/PrimaryButton'

import { register } from '../../src/services/authService'

export default function Register() {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  /* ======================
     Button press micro-animation
  ====================== */
  const scale = useSharedValue(1)

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing details', 'Fill in all fields')
      return
    }

    try {
      setLoading(true)
      scale.value = withSpring(0.96)

      await register({ name, email, password })

      // ✅ Auto-login success
      router.replace('/(tabs)/wardrobe')
    } catch (e: any) {
      Alert.alert(
        'Registration failed',
        e.message || 'Please try again'
      )
    } finally {
      scale.value = withSpring(1)
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
        <Animated.View
          entering={FadeInUp.duration(420)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Create account
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            A calm space for your wardrobe
          </Text>
        </Animated.View>

        {/* Form */}
        <View style={styles.form}>

          <Animated.View entering={FadeInUp.delay(80).duration(360)}>
            <Field
              label="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(140).duration(360)}>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(360)}>
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(260).duration(360)}
            style={buttonStyle}
          >
            <PrimaryButton
              title="Create account"
              loading={loading}
              onPress={handleRegister}
            />
          </Animated.View>

        </View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
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
