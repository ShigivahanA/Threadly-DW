import { useState } from 'react'

const AddItemModal = ({ onClose, onAdd, loading, error }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [category, setCategory] = useState('shirt')

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return
    const success = await onAdd({ file, category })
    if (success) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 space-y-4">
        <h2 className="text-lg font-semibold">Add Item</h2>

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover rounded-lg"
          />
        ) : (
          <label className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-gray-500">
            Tap to add photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="shirt">Shirt</option>
          <option value="tshirt">T-Shirt</option>
          <option value="pant">Pant</option>
          <option value="jeans">Jeans</option>
          <option value="jacket">Jacket</option>
        </select>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded"
          >
            {loading ? 'Uploading…' : 'Save'}
          </button>

          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddItemModal
