import { useState } from 'react'
import contactService from '../services/contactService'
import Spinner from '../components/ui/Spinner'
import useToast from '../hooks/useToast'

const Contact = () => {
  const { pushToast } = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      await contactService.sendMessage(form)

      // ✅ reset form
      setForm({
        name: '',
        email: '',
        message: ''
      })

      setSent(true)

      pushToast({
        type: 'success',
        message: 'Message received. We’ll reply thoughtfully.'
      })
    } catch (err) {
      pushToast({
        type: 'error',
        message: err.message || 'Failed to send message'
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="px-4 py-16 ">
      <div className="mx-auto max-w-xl space-y-10">

        <header className="text-center space-y-3">
          <h1 className="text-3xl font-semibold dark:text-neutral-500">
            Contact
          </h1>

          <p className="text-neutral-500">
            Questions, feedback, or thoughtful notes — all welcome.
          </p>
        </header>

        {sent ? (
          <p className="text-center text-sm text-neutral-500">
            Your message has been delivered.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              placeholder="Your name"
              value={form.name}
              onChange={e => update('name', e.target.value)}
            />

            <Input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => update('email', e.target.value)}
            />

            <textarea
              required
              rows={4}
              placeholder="Your message"
              value={form.message}
              onChange={e => update('message', e.target.value)}
              className="
                w-full rounded-xl border p-3 text-sm
                bg-white dark:bg-neutral-900
                border-neutral-200 dark:border-neutral-700
                focus:outline-none focus:ring-2 focus:ring-black/10
              "
            />

            <button
              disabled={sending}
              className="
                w-full rounded-xl py-2.5
                bg-black text-white
                dark:bg-neutral-500 dark:text-black
                font-medium
                flex items-center justify-center gap-2
                disabled:opacity-60
              "
            >
              {sending ? <Spinner /> : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default Contact

const Input = (props) => (
  <input
    {...props}
    className="
      w-full rounded-xl border p-3 text-sm
      bg-white dark:bg-neutral-900
      border-neutral-200 dark:border-neutral-700
      focus:outline-none focus:ring-2 focus:ring-black/10
    "
  />
)
