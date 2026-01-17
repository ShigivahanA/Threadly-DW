import { useState } from 'react'
import { Link } from 'react-router-dom'
import Field from '../components/ui/Field'
import useToast from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'

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
        'If the email exists, a reset link has been sent',
        'success'
      )
    } catch {
      // silent by design
      showToast(
        'If the email exists, a reset link has been sent',
        'success'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 pt-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Forgot password
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            We’ll send you a reset link
          </p>
        </div>

        {/* Card */}
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
            label="Email"
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
              text-white dark:text-black
              font-medium
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Back to{' '}
          <Link
            to="/login"
            className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
