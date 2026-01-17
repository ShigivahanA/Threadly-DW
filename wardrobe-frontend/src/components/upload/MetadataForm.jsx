import ColorPickerFromImage from './ColorPickerFromImage'

const MetadataForm = ({ meta, setMeta, imageSrc }) => {
  const update = (key, value) =>
    setMeta(p => ({ ...p, [key]: value }))

  const baseInputClass = `
    w-full
    rounded-xl
    border
    px-3 py-2
    text-sm
    transition
    bg-white text-neutral-900
    border-neutral-300
    focus:outline-none focus:ring-2 focus:ring-black/10
    dark:bg-neutral-900 dark:text-neutral-100
    dark:border-neutral-700
    dark:focus:ring-white/10
  `

  return (
    <div className="space-y-5">

      {/* Category */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Category
        </label>

        <select
          value={meta.category}
          onChange={(e) => update('category', e.target.value)}
          className={`
            ${baseInputClass}
            appearance-none
            bg-[length:16px]
            bg-no-repeat
            bg-[right_0.75rem_center]
          `}
        >
          <option value="" disabled className="text-neutral-400">
            Select category
          </option>
          <option value="shirt">Shirt</option>
          <option value="tshirt">T-Shirt</option>
          <option value="pant">Pant</option>
          <option value="jeans">Jeans</option>
          <option value="jacket">Jacket</option>
          <option value="shoes">Shoes</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Size */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Size
        </label>
        <input
          placeholder="e.g. M, L, 32"
          value={meta.size}
          onChange={(e) => update('size', e.target.value)}
          className={baseInputClass}
        />
      </div>

      {/* Brand */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Brand
        </label>
        <input
          placeholder="e.g. Nike, Zara"
          value={meta.brand}
          onChange={(e) => update('brand', e.target.value)}
          className={baseInputClass}
        />
      </div>

      {/* 🎨 Color picker */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Colors
        </label>
        <ColorPickerFromImage
          imageSrc={imageSrc}
          colors={meta.colors}
          onChange={(colors) => update('colors', colors)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Notes
        </label>
        <textarea
          placeholder="Optional notes about this item"
          value={meta.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          className={`${baseInputClass} resize-none`}
        />
      </div>

    </div>
  )
}

export default MetadataForm
