import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Field from '../components/ui/Field'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../components/ui/Spinner'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 pt-12 pb-16 min-h-screen">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Start building your digital wardrobe
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
          {/* Error */}
          {error && (
            <div className="
              rounded-lg
              border
              border-red-200 dark:border-red-900/40
              bg-red-50 dark:bg-red-900/20
              px-3 py-2
              text-sm
              text-red-700 dark:text-red-300
            ">
              {error}
            </div>
          )}

          <Field
            label="Name"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />

          <Field
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />

          <Field
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-black
              py-2.5
              text-white dark:text-black dark:bg-neutral-300
              font-medium
              transition
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? <Spinner /> : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
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

export default Register
