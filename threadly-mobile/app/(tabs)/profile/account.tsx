import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

import profileService from '@/src/services/profileService'
import { logout } from '@/src/services/authService'
import PrimaryButton from '@/src/components/auth/PrimaryButton'
import ProfileHeader from '@/src/components/Profile/ProfileHeader'
import { useToast } from '@/src/components/Toast/ToastProvider'
import OtpInput from '@/src/components/auth/OtpInput'
import SecureInput from '@/src/components/auth/SecureInput'
import AccountSkeleton from '@/src/components/Profile/AccountSkeleton'



export default function AccountScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const toast = useToast()
  const [exporting, setExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sessions, setSessions] = useState<any[]>([])
  const [pwStep, setPwStep] = useState<'idle' | 'otp' | 'change'>('idle')
  const [pwLoading, setPwLoading] = useState(false)

  const [otp, setOtp] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  /* ---------------- Load profile ---------------- */
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await profileService.getProfile()
        if (!mounted) return

        setName(res.name)
        setEmail(res.email)
        setSessions(res.sessions || [])
      } catch {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        toast.show('Failed to load profile', 'error')
      } finally {
        mounted && setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  /* ---------------- Save profile ---------------- */
  const saveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)

    try {
      await profileService.updateProfile({ name })
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      toast.show('Profile updated successfully', 'success')
    } catch {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      )
      toast.show('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const resetPasswordFlow = () => {
    setPwStep('idle')
    setOtp('')
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
  }

  /* ---------------- Terminate session ---------------- */
  const terminateSession = async (id: string) => {
    try {
      await profileService.terminateSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch {
      toast.show('Failed to terminate session', 'error')
    }
  }

  /* ---------------- Delete account ---------------- */
  const deleteAccount = async () => {
    toast.show('Deleting account...', 'info')
    Alert.alert(
      'Delete account',
      'This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await profileService.deleteAccount()
            await logout()
          },
        },
      ]
    )
  }

  const handleExportData = async () => {
    if (exporting) return

    setExporting(true)
    toast.show('Preparing your data export…', 'info')

    try {
      await profileService.exportData()

      toast.show(
        'Your data export has started. You’ll receive an email shortly.',
        'success'
      )
    } catch {
      toast.show('Failed to export data', 'error')
    } finally {
      setExporting(false)
    }
  }


  const handleLogout = async () => {
  toast.show('Signing out...', 'info')

  try {
    await logout()
    toast.show('Signed out successfully', 'success')
    router.replace('/')
  } catch {
    toast.show('Logout failed', 'error')
  }
}


  if (loading) {
    return <AccountSkeleton />
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
              <ProfileHeader loading={loading} />
        </View>
      {/* ---------- Content ---------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              spacing.xxl + 80, // room for floating pill bar
          },
        ]}
      >
        <Card colors={colors}>
          <Field label="Name" colors={colors}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />
          </Field>

          <Field label="Email" colors={colors}>
            <Text style={{ color: colors.textSecondary }}>
              {email}
            </Text>
          </Field>

          <PrimaryButton
            title="Save changes"
            onPress={saveProfile}
            loading={saving}
          />
        </Card>

        <Card colors={colors} title="Active sessions">
          {sessions.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              This is your only session.
            </Text>
          ) : (
            sessions.map(s => (
              <View
                key={s.id}
                style={[
                  styles.session,
                  { borderColor: colors.border },
                ]}
              >
                <View>
                  <Text style={{ color: colors.textPrimary }}>
                    {s.device || 'Unknown device'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}
                  >
                    {s.ip}
                  </Text>
                </View>

                <Pressable
                  onPress={() => terminateSession(s.id)}
                >
                  <Text style={{ color: '#ff4d4f' }}>
                    Log out
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </Card>

        <Card colors={colors} title="Your data">
  <Pressable
    onPress={handleExportData}
    disabled={exporting}
    style={({ pressed }) => [
      styles.exportRow,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        opacity: exporting ? 0.6 : pressed ? 0.85 : 1,
      },
    ]}
  >
    <View style={styles.exportLeft}>
      <Ionicons
        name="download-outline"
        size={18}
        color={colors.textPrimary}
      />
      <Text
        style={[
          styles.exportText,
          { color: colors.textPrimary },
        ]}
      >
        Export my data
      </Text>
    </View>

    {exporting ? (
      <Text
        style={{
          fontSize: 12,
          color: colors.textSecondary,
        }}
      >
        Preparing…
      </Text>
    ) : (
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.textSecondary}
      />
    )}
  </Pressable>
</Card>


        <Card colors={colors} title="Security">
  {/* STEP 1 — Idle */}
  {pwStep === 'idle' && (
    <>
      <Text style={{ color: colors.textSecondary }}>
        Change your password securely using email verification.
      </Text>

      <PrimaryButton
        title="Change password"
        loading={pwLoading}
        onPress={async () => {
          setPwLoading(true)
          try {
            await profileService.requestPasswordOtp()
            setPwStep('otp')
            toast.show('OTP sent to your email', 'success')
          } catch {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            toast.show('Failed to send OTP', 'error')
          } finally {
            setPwLoading(false)
          }
        }}
      />
    </>
  )}

  {/* STEP 2 — OTP */}
  {pwStep === 'otp' && (
    <>
      <Text style={{ color: colors.textSecondary }}>
        Enter the 6-digit code sent to your email.
      </Text>

      <Field label="One-time password" colors={colors}>
        <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={() => {}}
            error={false}
          />
      </Field>

      <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
  <PrimaryButton
    title="Verify code"
    onPress={() => setPwStep('change')}
    disabled={otp.length !== 6}
  />

  <Pressable
    onPress={resetPasswordFlow}
    hitSlop={8}
    style={{ alignSelf: 'center' }}
  >
    <Text
      style={{
        color: colors.textSecondary,
        textDecorationLine: 'underline',
        fontSize: 14,
      }}
    >
      Cancel
    </Text>
  </Pressable>
</View>
    </>
  )}

  {/* STEP 3 — Change */}
  {pwStep === 'change' && (
    <>
      <Text style={{ color: colors.textSecondary }}>
        Confirm your current password and set a new one.
      </Text>

      <Field label="Current password" colors={colors}>
        <SecureInput
    value={currentPassword}
    onChangeText={setCurrentPassword}
  />
      </Field>

      <Field label="New password" colors={colors}>
         <SecureInput
            value={password}
            onChangeText={setPassword}
          />
      </Field>

      <Field label="Confirm new password" colors={colors}>
        <SecureInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
      </Field>

      <View style={{ gap: spacing.md }}>
  <PrimaryButton
    title="Update password"
    loading={pwLoading}
    onPress={async () => {
      if (
        !currentPassword ||
        !password ||
        !confirmPassword ||
        !otp
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        toast.show('All fields are required', 'error')
        return
      }

      if (password !== confirmPassword) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        toast.show('Passwords do not match', 'error')
        return
      }

      setPwLoading(true)
      try {
        await profileService.changePassword({
          currentPassword,
          newPassword: password,
          otp,
        })
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        )
        toast.show(
          'Password updated. Please sign in again.',
          'success'
        )

        await logout()
      } catch (e: any) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        toast.show(
          e?.message || 'Password update failed',
          'error'
        )
      } finally {
        setPwLoading(false)
      }
    }}
  />

  <Pressable
    onPress={resetPasswordFlow}
    hitSlop={8}
    style={{ alignSelf: 'center' }}
  >
    <Text
      style={{
        color: colors.textSecondary,
        textDecorationLine: 'underline',
        fontSize: 14,
      }}
    >
      Cancel
    </Text>
  </Pressable>
</View>
    </>
  )}
</Card>

        <Card colors={colors} danger title="Danger zone">
  <View style={{ gap: spacing.md }}>

    {/* Logout (neutral) */}
    <Pressable
      onPress={handleLogout}
      hitSlop={8}
      style={[
        styles.dangerRow,
        {
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.dangerText,
          { color: colors.textPrimary },
        ]}
      >
        Log out
      </Text>
    </Pressable>

    {/* Delete account (destructive) */}
    <Pressable
      onPress={deleteAccount}
      hitSlop={8}
      style={[
        styles.dangerRow,
        {
          backgroundColor:
            theme === 'dark'
              ? 'rgba(239,68,68,0.12)'
              : 'rgba(220,38,38,0.08)',
          borderColor: colors.danger,
        },
      ]}
    >
      <Text
        style={[
          styles.dangerText,
          { color: colors.danger },
        ]}
      >
        Delete account
      </Text>
    </Pressable>

  </View>
</Card>

      </ScrollView>
    </SafeAreaView>
  )
}

/* ================= UI Components ================= */

const Card = ({
  title,
  children,
  colors,
  danger,
}: any) => (
  <View
    style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        borderColor: danger
          ? 'rgba(255,77,79,0.4)'
          : colors.border,
      },
    ]}
  >
    {title && (
      <Text
        style={[
          styles.cardTitle,
          {
            color: danger
              ? '#ff4d4f'
              : colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    )}
    <View style={{ gap: spacing.md }}>{children}</View>
  </View>
)

const Field = ({
  label,
  children,
  colors,
}: any) => (
  <View style={{ gap: 6 }}>
    <Text
      style={{
        fontSize: 12,
        color: colors.textSecondary,
      }}
    >
      {label}
    </Text>
    {children}
  </View>
)

/* ================= Styles ================= */

const styles = StyleSheet.create({
 safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },

  cardTitle: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  session: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dangerRow: {
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
},

dangerText: {
  fontSize: 15,
  fontWeight: '500',
},
exportRow: {
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  paddingHorizontal: spacing.md,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

exportLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
},

exportText: {
  fontSize: 15,
  fontWeight: '500',
},

})
