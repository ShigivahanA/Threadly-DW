import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Field from '../components/ui/Field'
import useToast from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'

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
      <div className="pt-20 text-center text-sm text-neutral-600">
        Invalid reset link
      </div>
    )
  }

  return (
    <div className="flex justify-center px-4 pt-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Reset password
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Choose a new password
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
            rounded-2xl
            border
            border-neutral-200 dark:border-neutral-700
            bg-white dark:bg-neutral-800
            p-6
            shadow-sm
          "
        >
          <Field
            label="New password"
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Field
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
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
              text-white dark:text-black
              font-medium
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
