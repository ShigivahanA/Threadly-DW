import { useRef } from 'react'

const OtpInput = ({ value, onChange, disabled }) => {
  const inputs = useRef([])

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '')

    const next = value.split('')
    next[idx] = val || '' // allow clearing
    onChange(next.join(''))

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = value.split('')

      if (next[idx]) {
        next[idx] = ''
        onChange(next.join(''))
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus()
        next[idx - 1] = ''
        onChange(next.join(''))
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()

    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pasted) return

    const chars = pasted.split('')
    const next = Array(6).fill('')
    chars.forEach((c, i) => (next[i] = c))

    onChange(next.join(''))

    const lastIndex = Math.min(chars.length - 1, 5)
    inputs.current[lastIndex]?.focus()
  }

  return (
    <div
      className="flex justify-between gap-2 px-1 py-1"
      onPaste={handlePaste}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="
            w-12 h-12 
            text-center text-lg font-semibold
            rounded-lg border
            bg-white dark:bg-neutral-900 transition
          "
        />
      ))}
    </div>
  )
}

export default OtpInput
