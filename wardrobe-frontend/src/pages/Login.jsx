import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Field from '../components/ui/Field'
import { useNavigate, Link } from 'react-router-dom'
import useToast from '../hooks/useToast'

import AnimatedSection from '../components/auth/AnimatedSection'
import OtpInput from '../components/auth/OtpInput'
import ActionButton from '../components/auth/ActionButton'

const Login = () => {
  const { login, requestOtp, verifyOtpLogin } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('password') // password | otp
  const [step, setStep] = useState('email') // email | verify

  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: ''
  })

  const [loading, setLoading] = useState(false)

  // UX enhancements
  const [cooldown, setCooldown] = useState(0)
  const [shakeOtp, setShakeOtp] = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  /* ======================
     AUTO SUBMIT OTP
  ====================== */
  useEffect(() => {
    if (
      mode === 'otp' &&
      step === 'verify' &&
      form.otp.length === 6 &&
      !loading
    ) {
      handleOtpVerify()
    }
  }, [form.otp])

  /* ======================
     OTP COOLDOWN TIMER
  ====================== */
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown(c => c - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  /* ======================
     PASSWORD LOGIN
  ====================== */
  const handlePasswordLogin = async () => {
    setLoading(true)
    try {
      await login({
        email: form.email,
        password: form.password
      })
      navigate('/', { replace: true })
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  /* ======================
     OTP REQUEST
  ====================== */
  const handleOtpRequest = async () => {
    if (!form.email) {
      showToast('Enter your email', 'error')
      return
    }

    setLoading(true)
    try {
      await requestOtp(form.email)
      setStep('verify')
      setCooldown(30)
      setForm(p => ({ ...p, otp: '' }))
      showToast('OTP sent to your email', 'success')
    } catch {
      showToast('Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  /* ======================
     OTP VERIFY
  ====================== */
  const handleOtpVerify = async () => {
    if (form.otp.length !== 6) return

    setLoading(true)
    try {
      await verifyOtpLogin({
        email: form.email,
        otp: form.otp
      })
      navigate('/', { replace: true })
    } catch (err) {
      setShakeOtp(true)
      showToast(err.message || 'Invalid OTP', 'error')

      setTimeout(() => setShakeOtp(false), 400)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 pt-12 sm:pt-16 mb-20">
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold dark:text-neutral-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Login to your wardrobe
          </p>
        </div>

        {/* Mode switch */}
        <div className="relative flex rounded-xl border overflow-hidden text-sm">
          <div
            className={`
              absolute inset-y-0 w-1/2
              bg-black dark:bg-white
              transition-transform duration-300 ease-out
              ${mode === 'otp' ? 'translate-x-full' : ''}
            `}
          />
          {['password', 'otp'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setStep('email')
                setForm(p => ({ ...p, otp: '' }))
              }}
              className={`
                relative z-10 flex-1 py-2
                transition-colors duration-300
                ${mode === m
                  ? 'text-white dark:text-black'
                  : 'text-neutral-700 dark:text-neutral-300'}
              `}
            >
              {m === 'password' ? 'Password' : 'OTP'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-white dark:bg-neutral-800 p-6 shadow-sm">

          {/* Email */}
          <Field
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading || step === 'verify'}
          />

          {/* Adaptive content */}
          <div className="mt-5">

            {/* PASSWORD */}
            <AnimatedSection show={mode === 'password'}>
              <Field
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <ActionButton loading={loading} onClick={handlePasswordLogin}>
                Login
              </ActionButton>
            </AnimatedSection>

            {/* OTP REQUEST */}
            <AnimatedSection show={mode === 'otp' && step === 'email'} compact>
              <ActionButton loading={loading} onClick={handleOtpRequest}>
                Send OTP
              </ActionButton>
            </AnimatedSection>

            {/* OTP VERIFY */}
            <AnimatedSection show={mode === 'otp' && step === 'verify'}>
              <div className={shakeOtp ? 'animate-shake' : ''}>
                <OtpInput
                  value={form.otp}
                  onChange={(otp) =>
                    setForm(p => ({ ...p, otp }))
                  }
                  disabled={loading}
                />
              </div>

              <ActionButton loading={loading} onClick={handleOtpVerify}>
                Verify OTP
              </ActionButton>

              <button
                disabled={loading || cooldown > 0}
                onClick={handleOtpRequest}
                className="
                  w-full text-sm text-center
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : 'Resend OTP'}
              </button>
            </AnimatedSection>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 ">
          No account?{' '}
          <Link to="/register" className="font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
