import { useEffect, useRef, useState } from 'react'

const ColorPickerFromImage = ({ imageSrc, colors, onChange }) => {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!imageSrc) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      imgRef.current = img
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
  }, [imageSrc])

  const pickColor = (e) => {
    if (!active) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')

    const x = Math.floor(
      ((e.clientX - rect.left) / rect.width) * canvas.width
    )
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * canvas.height
    )

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2])

    if (!colors.includes(hex)) {
      onChange([...colors, hex])
    }
  }

  const removeColor = (hex) => {
    onChange(colors.filter(c => c !== hex))
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Pick colors from image
        </p>

        <button
          type="button"
          onClick={() => setActive(p => !p)}
          className={`
            text-xs font-medium transition
            ${active
              ? 'text-black dark:text-white'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}
          `}
        >
          {active ? 'Picking… tap image' : 'Activate picker'}
        </button>
      </div>

      {/* Canvas */}
      <div
        className={`
          relative overflow-hidden rounded-xl border
          transition
          ${active
            ? 'border-black dark:border-white'
            : 'border-neutral-300 dark:border-neutral-700'}
        `}
      >
        <canvas
          ref={canvasRef}
          onClick={pickColor}
          className={`
            w-full
            ${active
              ? 'cursor-crosshair'
              : 'opacity-70 pointer-events-none'}
          `}
        />

        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 dark:bg-white/20 px-3 py-1 text-xs text-white">
              Activate to pick colors
            </div>
          </div>
        )}
      </div>

      {/* Selected colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => removeColor(color)}
              className="
                relative h-8 w-8 rounded-full border
                transition hover:scale-105
                focus:outline-none
              "
              style={{ backgroundColor: color }}
              title={`Remove ${color}`}
            >
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                ×
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ======================
   Helpers
====================== */
const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')}`

export default ColorPickerFromImage
