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
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

import profileService from '@/src/services/profileService'
import authService from '@/src/services/authService'
import PrimaryButton from '@/src/components/auth/PrimaryButton'

export default function AccountScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sessions, setSessions] = useState<any[]>([])

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
        Alert.alert('Error', 'Failed to load profile')
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
    } catch {
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- Terminate session ---------------- */
  const terminateSession = async (id: string) => {
    try {
      await profileService.terminateSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch {
      Alert.alert('Error', 'Failed to terminate session')
    }
  }

  /* ---------------- Delete account ---------------- */
  const deleteAccount = async () => {
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
            await authService.logout()
          },
        },
      ]
    )
  }

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ================= Header ================= */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.textPrimary },
          ]}
        >
          Account
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        {/* -------- Account -------- */}
        <Card>
          <Section title="Profile">
            <Field label="Name">
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
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
              />
            </Field>

            <Field label="Email">
              <Text style={{ color: colors.textSecondary }}>
                {email}
              </Text>
            </Field>

            <PrimaryButton
              title="Save changes"
              onPress={saveProfile}
              loading={saving}
            />
          </Section>
        </Card>

        {/* -------- Sessions -------- */}
        <Card>
          <Section title="Active sessions">
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
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    },
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
                    <Text style={{ color: colors.error }}>
                      Log out
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </Section>
        </Card>

        {/* -------- Data -------- */}
        <Card>
          <Section title="Your data">
            <Pressable
              onPress={profileService.exportData}
            >
              <Text style={{ color: colors.textPrimary }}>
                Export my data
              </Text>
            </Pressable>
          </Section>
        </Card>

        {/* -------- Danger -------- */}
        <Card danger>
          <Section title="Danger zone">
            <Pressable onPress={deleteAccount}>
              <Text style={{ color: colors.error }}>
                Delete account
              </Text>
            </Pressable>
          </Section>
        </Card>
      </ScrollView>
    </View>
  )
}

/* ================= UI Helpers ================= */

const Card = ({
  children,
  danger,
}: {
  children: React.ReactNode
  danger?: boolean
}) => {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: danger
            ? colors.error
            : colors.border,
        },
      ]}
    >
      {children}
    </View>
  )
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <View style={{ gap: spacing.md }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
)

const Field = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <View style={{ gap: 6 }}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
)

/* ================= Styles ================= */

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  fieldLabel: {
    fontSize: 12,
    opacity: 0.7,
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
})
