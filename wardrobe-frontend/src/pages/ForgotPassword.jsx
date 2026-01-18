import { useState } from 'react'
import { Link } from 'react-router-dom'
import Field from '../components/ui/Field'
import useToast from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'


const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPassword(email)
      showToast(
        'A reset link has been sent',
        'success'
      )
    } catch {
      // intentionally silent (security)
      showToast(
        'If the email exists, a reset link has been sent',
        'success'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-16 pb-32">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Reset your password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Enter the email associated with your account and we’ll send you a secure
            link to reset your password.
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
            label="Email address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? <Spinner /> : 'Send reset link'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="
              font-medium
              text-neutral-900 dark:text-neutral-100
              hover:underline
              underline-offset-4
            "
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
