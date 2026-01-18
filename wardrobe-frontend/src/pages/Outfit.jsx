import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OutfitItemCard from '../components/outfit/OutfitItemCard'
import outfitService from '../services/outfitService'
import Spinner from '../components/ui/Spinner'

const Outfit = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [showSave, setShowSave] = useState(false)
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  if (!state?.top || !state?.bottom || !state?.shoe) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500 dark:text-neutral-400">
        No outfit selected
      </div>
    )
  }

  const { top, bottom, shoe } = state
  const today = new Date().toISOString().slice(0, 10)

  const handleSave = async () => {
  if (!occasion.trim()) return

  setSaving(true)

  try {
    const payload = {
      items: {
        top: top._id,
        bottom: bottom._id,
        footwear: shoe._id
      },
      occasion,
      notes
    }

    await outfitService.createOutfit(payload)

    navigate('/outfit-folders')
  } catch (err) {
    console.error('Failed to save outfit', err)
    setSaving(false)
  }
}


  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <h1 className="text-2xl font-semibold text-center dark:text-neutral-500">
        Your Outfit
      </h1>

      {/* Outfit preview */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        <OutfitItemCard item={top} />
        <OutfitItemCard item={bottom} />
        <OutfitItemCard item={shoe} />
      </div>

      {/* Save section */}
      {showSave && (
        <div className="
          max-w-xl mx-auto space-y-4
          border-t pt-6
          border-neutral-200 dark:border-neutral-700
        ">
          <input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Where are you wearing this?"
            className="
              w-full rounded-xl border p-3 text-sm
              bg-white dark:bg-neutral-900
              border-neutral-200 dark:border-neutral-700 dark:text-white
            "
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={3}
            className="
              w-full rounded-xl border p-3 text-sm
              bg-white dark:bg-neutral-900 
              border-neutral-200 dark:border-neutral-700 dark:text-white
            "
          />

          <p className="text-xs text-neutral-500">
            Date: {today} · Wear count starts at 1
          </p>

          <button
            disabled={saving}
            onClick={handleSave}
            className="
              w-full rounded-xl py-2.5
              bg-black text-white
              dark:bg-white dark:text-black
              font-medium
              disabled:opacity-50
            "
          >
            {saving ? <Spinner /> : 'Save outfit'}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-6 pt-4">
        {!showSave && (
          <button
            onClick={() => setShowSave(true)}
            className="text-sm underline text-neutral-500 dark:text-neutral-400"
          >
            Save this outfit
          </button>
        )}

        <button
          onClick={() => navigate('/pairing')}
          className="text-sm underline text-neutral-500  dark:text-neutral-400"
        >
          Choose again
        </button>
      </div>
    </div>
  )
}

export default Outfit
