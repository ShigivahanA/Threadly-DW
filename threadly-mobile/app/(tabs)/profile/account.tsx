import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown, Layout, FadeIn, FadeOut } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { normalize } from '@/src/utils/responsive'

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

  // -- State --
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

  const [showSessions, setShowSessions] = useState(false)

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
        toast.show('Failed to load identity', 'error')
      } finally {
        mounted && setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  /* ---------------- Actions ---------------- */
  const saveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await profileService.updateProfile({ name })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      toast.show('Identity updated', 'success')
    } catch {
      toast.show('Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const terminateSession = async (id: string) => {
    try {
      await profileService.terminateSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      toast.show('Failed to revoke access', 'error')
    }
  }

  const deleteAccount = async () => {
    Alert.alert('REVOKE IDENTITY?', 'This action is irreversible.', [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'DELETE',
        style: 'destructive',
        onPress: async () => {
          try {
            await profileService.deleteAccount()
            try { await logout() } catch (e) { }
            router.replace('/')
          } catch {
            toast.show('Failed to delete account', 'error')
          }
        },
      },
    ])
  }

  const handleExportData = async () => {
    if (exporting) return
    setExporting(true)
    try {
      await profileService.exportData()
      Alert.alert("DATA EXPORT", "Your archive is being prepared and will be emailed shortly.")
    } catch {
      toast.show('Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Ignore server error, local tokens are cleared
    } finally {
      router.replace('/')
    }
  }

  const resetPasswordFlow = () => {
    setPwStep('idle')
    setOtp('')
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
  }

  if (loading) return <AccountSkeleton />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <ProfileHeader loading={loading} />
        </View>

        <Animated.View entering={FadeInDown.duration(600)} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>// IDENTITY_CONFIG</Text>
        </Animated.View>

        {/* --- Profile Module --- */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.module, { borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, { color: colors.textPrimary }]}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL</Text>
            <Text style={[styles.value, { color: colors.textSecondary }]}>{email}</Text>
          </View>
          <View style={{ padding: 16 }}>
            <PrimaryButton title="UPDATE IDENTITY" onPress={saveProfile} loading={saving} />
          </View>
        </Animated.View>

        {/* --- Security Module --- */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginBottom: 8, marginTop: 24 }]}>// SECURITY_PROTOCOLS</Text>

          {/* Main Container - Animates Layout Changes */}
          <Animated.View
            layout={Layout.duration(300)}
            style={[styles.module, { borderColor: colors.border }]}
          >
            {/* Expandable Sessions Header */}
            <Pressable onPress={() => setShowSessions(!showSessions)} style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <Ionicons name="desktop-outline" size={18} color={colors.textPrimary} />
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>ACTIVE SESSIONS ({sessions.length})</Text>
              </View>
              <Ionicons name={showSessions ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
            </Pressable>

            {/* Expandable Sessions Body */}
            {showSessions && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                exiting={FadeOut.duration(200)}
              >
                {sessions.map(s => (
                  <View key={s.id} style={[styles.sessionRow, { borderTopColor: colors.border }]}>
                    <View>
                      <Text style={[styles.deviceText, { color: colors.textPrimary }]}>{s.device || 'Unknown Device'}</Text>
                      <Text style={[styles.ipText, { color: colors.textSecondary }]}>{s.ip}</Text>
                    </View>
                    <Pressable onPress={() => terminateSession(s.id)}>
                      <Text style={styles.revokeText}>REVOKE</Text>
                    </Pressable>
                  </View>
                ))}
              </Animated.View>
            )}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Password Flow */}
            <View style={{ padding: 16 }}>
              {pwStep === 'idle' && (
                <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
                  <Pressable
                    onPress={async () => {
                      setPwLoading(true)
                      try { await profileService.requestPasswordOtp(); setPwStep('otp'); toast.show('OTP sent', 'success') }
                      catch { toast.show('Failed to send OTP', 'error') }
                      finally { setPwLoading(false) }
                    }}
                    disabled={pwLoading}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 24 }}
                  >
                    <View style={styles.actionLeft}>
                      <Ionicons name="key-outline" size={18} color={colors.textPrimary} />
                      <Text style={[styles.actionText, { color: colors.textPrimary }]}>CHANGE PASSWORD</Text>
                    </View>
                    {pwLoading ? <ActivityIndicator size="small" color={colors.textSecondary} /> : <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />}
                  </Pressable>
                </Animated.View>
              )}

              {pwStep === 'otp' && (
                <Animated.View entering={FadeIn.duration(400).delay(100)}>
                  <Text style={[styles.stepTitle, { color: colors.textSecondary }]}>ENTER VERIFICATION CODE</Text>
                  <OtpInput value={otp} onChange={setOtp} onComplete={() => { }} error={false} />
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                    <View style={{ flex: 1 }}><PrimaryButton title="VERIFY CODE" onPress={() => setPwStep('change')} disabled={otp.length !== 6} /></View>
                    <Pressable onPress={resetPasswordFlow} style={styles.cancelBtn}><Text style={[styles.cancelText, { color: colors.textSecondary }]}>CANCEL</Text></Pressable>
                  </View>
                </Animated.View>
              )}

              {pwStep === 'change' && (
                <Animated.View entering={FadeIn.duration(400).delay(100)}>
                  <Text style={[styles.stepTitle, { color: colors.textSecondary, textAlign: 'left', marginBottom: 16 }]}>SET NEW CREDENTIALS</Text>
                  <View style={{ gap: 12 }}>
                    <SecureInput value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current Password" />
                    <SecureInput value={password} onChangeText={setPassword} placeholder="New Password" />
                    <SecureInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm New" />
                    <PrimaryButton title="UPDATE PASSWORD" loading={pwLoading} onPress={async () => {
                      if (!currentPassword || !password || !confirmPassword || !otp) return toast.show('All fields required', 'error')
                      if (password !== confirmPassword) return toast.show('Mismatch', 'error')
                      setPwLoading(true)
                      try {
                        await profileService.changePassword({ currentPassword, newPassword: password, otp })
                        toast.show('Updated. Please sign in.', 'success')

                        // Clear local session; ignore server-side logout errors
                        try {
                          await logout()
                        } catch (e) {
                          // Logged out locally anyway
                        }

                        // Use a small delay to ensure toast is visible then redirect
                        router.replace('/')
                      } catch (err) {
                        toast.show('Update failed', 'error')
                      } finally {
                        setPwLoading(false)
                      }
                    }} />
                    <Pressable onPress={resetPasswordFlow} style={{ alignSelf: 'center' }}><Text style={[styles.cancelText, { color: colors.textSecondary }]}>CANCEL</Text></Pressable>
                  </View>
                </Animated.View>
              )}
            </View>

          </Animated.View>
        </Animated.View>

        {/* --- Data & Danger --- */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ marginTop: 24, paddingBottom: 60 }}>
          <Pressable onPress={handleExportData} style={[styles.module, { borderColor: colors.border, padding: 16 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={styles.actionLeft}>
                <Ionicons name="download-outline" size={18} color={colors.textPrimary} />
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>{exporting ? "EXPORTING..." : "EXPORT DATA"}</Text>
              </View>
            </View>
          </Pressable>

          <View style={{ marginTop: 24, gap: 12 }}>
            <Pressable onPress={deleteAccount} style={{ alignSelf: 'center', padding: 12, marginBottom: 12 }}>
              <Text style={[styles.deleteText, { color: colors.danger }]}>DELETE IDENTITY</Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: normalize(10),
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
  },
  module: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: normalize(10),
    fontWeight: '700',
    letterSpacing: 1,
  },
  value: {
    fontSize: normalize(13),
    fontFamily: 'Courier',
  },
  input: {
    fontSize: normalize(15),
    fontFamily: 'Courier',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  actionRow: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: normalize(13),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sessionRow: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  deviceText: { fontSize: normalize(13), fontWeight: '500' },
  ipText: { fontSize: normalize(11), fontFamily: 'Courier' },
  revokeText: { fontSize: normalize(9), fontWeight: '700', color: '#ff4d4f', letterSpacing: 1 },
  stepTitle: { fontSize: normalize(11), marginBottom: 12, textAlign: 'center' },
  cancelBtn: { justifyContent: 'center', paddingHorizontal: 16 },
  cancelText: { fontSize: normalize(11), textDecorationLine: 'underline' },
  dangerBtn: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: { fontSize: normalize(13), fontWeight: '600' },
  deleteText: { fontSize: normalize(11), fontWeight: '700', letterSpacing: 1 },
})
