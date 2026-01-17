import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import profileService from '../services/profileService'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import useToast from '../hooks/useToast'
import Spinner from '../components/ui/Spinner'

const Profile = () => {
  const { user, logout,currentSessionId  } = useAuth()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [sessions, setSessions] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await profileService.getProfile()
        if (!mounted) return

        setName(res.name)
        setSessions(res.sessions || [])
      } catch {
        showToast('Failed to load profile', 'error')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => (mounted = false)
  }, [])

  if (loading) return <ProfileSkeleton />

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)

    try {
      await profileService.updateProfile({ name })
      showToast('Profile updated', 'success')
    } catch {
      showToast('Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    await profileService.exportData()
    showToast('Export request received', 'info')
  }

  const handleDelete = async () => {
    try {
      await profileService.deleteAccount()
      await logout()
    } catch {
      showToast('Account deletion failed', 'error')
    }
  }

  const terminateSession = async (sessionId) => {
  try {
    await profileService.terminateSession(sessionId)

    // 🔥 If current session → force logout
    if (sessionId === currentSessionId) {
      await logout()
      return
    }

    // Otherwise update UI
    setSessions(prev =>
      prev.filter(s => s.id !== sessionId)
    )

    showToast('Session terminated', 'success')
  } catch {
    showToast('Failed to terminate session', 'error')
  }
}


  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl space-y-16">

        {/* Header */}
        <header className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight dark:text-neutral-500">
            Profile & settings
          </h1>
          <p className="text-sm text-neutral-500">
            Manage your identity, data, and security preferences.
          </p>
        </header>

        {/* Account */}
        <Section>
          <SectionTitle>Account</SectionTitle>

          <div className="grid gap-6 max-w-xl">
            <Field label="Name">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Email">
              <input
                value={user.email}
                disabled
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
            </Field>

            <div>
              <button
                disabled={saving}
                onClick={handleSave}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-5 py-2.5
                  bg-black text-white
                  dark:bg-white dark:text-black
                  text-sm font-medium
                  transition
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-50
                "
              >
                {saving ? <Spinner /> : 'Save changes'}
              </button>
            </div>
          </div>
        </Section>

        {/* Sessions */}
{/* Sessions */}
<Section>
  <SectionTitle>Active sessions</SectionTitle>

  <div className="max-w-xl space-y-3">
    {sessions.length === 0 ? (
      <p className="text-sm text-neutral-500">
        You are currently signed in on this device only.
      </p>
    ) : (
      sessions.map(s => {
        const isCurrent = s.id === currentSessionId

        return (
          <div
            key={s.id}
            className="
              group
              rounded-2xl
              border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-900
              px-5 py-4
              flex items-start justify-between
              transition
              hover:border-neutral-300 dark:hover:border-neutral-700
            "
          >
            {/* Left */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {s.device || 'Unknown device'}
              </p>

              <p className="text-xs text-neutral-500">
                {s.ip || 'Unknown network'}
              </p>

              {s.lastActiveAt && (
                <p className="text-xs text-neutral-400">
                  Last active {new Date(s.lastActiveAt).toLocaleString()}
                </p>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {isCurrent ? (
                <span
                  className="
                    text-xs
                    px-2 py-1
                    rounded-full
                    bg-neutral-100 dark:bg-neutral-800
                    text-neutral-500
                  "
                >
                  Current
                </span>
              ) : (
                <button
                  onClick={() => terminateSession(s.id)}
                  className="
                    text-xs font-medium
                    text-red-600
                    underline underline-offset-4
                    opacity-80
                    group-hover:opacity-100
                  "
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        )
      })
    )}
  </div>
</Section>

        {/* Data */}
        <Section>
          <SectionTitle>Your data</SectionTitle>

          <p className="max-w-xl text-sm text-neutral-500">
            You can request a copy of your wardrobe and outfit data.
            This will be prepared and delivered securely.
          </p>

          <button
            onClick={handleExport}
            className="
              inline-block
              text-sm font-medium
              underline underline-offset-4
              text-neutral-700 dark:text-neutral-300
              hover:text-neutral-900 dark:hover:text-neutral-100
            "
          >
            Export my data
          </button>
        </Section>

        {/* Danger */}
        <Section danger>
          <SectionTitle>Danger zone</SectionTitle>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="
                text-sm font-medium
                text-red-600
                underline underline-offset-4
              "
            >
              Delete account
            </button>
          ) : (
            <div className="space-y-4 max-w-xl">
              <p className="text-sm text-neutral-500">
                This action permanently deletes your wardrobe, outfits,
                and usage history. This cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="
                    rounded-full px-5 py-2.5
                    bg-red-600 text-white
                    text-sm font-medium
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Confirm delete
                </button>

                <button
                  onClick={() => setConfirmDelete(false)}
                  className="
                    text-sm
                    underline underline-offset-4
                    text-neutral-600 dark:text-neutral-400
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </div>
    </main>
  )
}

export default Profile

/* ======================
   Local components
====================== */

const Section = ({ children, danger }) => (
  <section
    className={`
      space-y-6
      ${danger
        ? 'pt-10 border-t border-red-200 dark:border-red-900/40'
        : 'pt-10 border-t border-neutral-200 dark:border-neutral-800'}
    `}
  >
    {children}
  </section>
)

const SectionTitle = ({ children }) => (
  <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-400">
    {children}
  </h2>
)

const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-xs text-neutral-500 dark:text-neutral-500">
      {label}
    </label>
    {children}
  </div>
)

const inputClass = `
  w-full rounded-xl
  border border-neutral-200 dark:border-neutral-700
  bg-white dark:bg-neutral-900 dark:text-neutral-500
  px-3 py-2 text-sm
  focus:outline-none focus:ring-2 focus:ring-black/10
`
