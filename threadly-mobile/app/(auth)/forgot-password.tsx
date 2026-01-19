import { View, Text, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { lightColors, darkColors } from '../../src/theme/colors'
import { spacing } from '../../src/theme/spacing'
import { typography } from '../../src/theme/typography'

import Field from '../../src/components/auth/Field'
import PrimaryButton from '../../src/components/auth/PrimaryButton'

import { requestPasswordReset } from '../../src/services/authService'

export default function ForgotPassword() {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email address')
      return
    }

    try {
      setLoading(true)
      await requestPasswordReset(email)

      Alert.alert(
        'Check your email',
        'We’ve sent you a secure reset link.',
        [
          {
            text: 'Back to login',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      )
    } catch (e: any) {
      Alert.alert('Failed', e.message || 'Something went wrong')
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

        {/* Back */}
        <Text
          onPress={() => router.back()}
          style={[styles.back, { color: colors.textSecondary }]}
        >
          ← Back
        </Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Reset password
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We’ll send you a secure reset link
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <PrimaryButton
            title="Send reset link"
            loading={loading}
            onPress={handleSubmit}
          />
        </View>

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

  back: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    fontSize: 14,
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
    textAlign: 'center',
    ...typography.subtitle,
  },

  form: {
    width: '100%',
  },
})
