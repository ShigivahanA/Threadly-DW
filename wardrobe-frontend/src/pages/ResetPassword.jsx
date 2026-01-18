import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Field from '../components/ui/Field'
import useToast from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

const ResetPassword = () => {
  const { resetPassword } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const token = params.get('token')

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)

    try {
      await resetPassword({
        token,
        password: form.password
      })

      showToast('Password updated successfully', 'success')
      navigate('/login', { replace: true })
    } catch (err) {
      showToast(err.message || 'Invalid or expired link', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
        Invalid or expired reset link
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-12 px-4 pb-32">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Set a new password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Choose a strong password you haven’t used before.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-2xl
            border border-neutral-200 dark:border-neutral-700
            bg-white dark:bg-neutral-800
            p-6 sm:p-7
            shadow-sm
            space-y-6
          "
        >
          <Field
            label="New password"
            type="password"
            name="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Field
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter new password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-black dark:bg-white
              py-2.5
              text-sm
              font-medium
              text-white dark:text-black
              transition
              hover:opacity-90
              focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? <Spinner /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
