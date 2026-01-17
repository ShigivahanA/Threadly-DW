import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PairingCard from './PairingCard'

const CARD_WIDTH = 220
const GAP = 24
const STEP = CARD_WIDTH + GAP

const PairingRow = ({ title, items, onChange }) => {
  const [index, setIndex] = useState(0)

  // ✅ Start centered with variety
  useEffect(() => {
    if (!items || items.length === 0) return

    const startIndex =
      items.length > 2
        ? Math.floor(Math.random() * items.length)
        : 0

    setIndex(startIndex)
  }, [items])

  // ✅ Notify parent whenever selection changes
  useEffect(() => {
    if (!items || items.length === 0) return
    onChange?.(items[index])
  }, [index, items, onChange])

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-sm text-neutral-500">
        No {title.toLowerCase()} items
      </div>
    )
  }

  const prev = () =>
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))

  const next = () =>
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))

  return (
    <section className="space-y-5">
      <p className="text-sm uppercase tracking-widest text-neutral-500 text-center">
        {title}
      </p>

      <div className="relative overflow-hidden">
        <div
          className="
            flex items-center
            transition-transform duration-500
            ease-[cubic-bezier(.22,.61,.36,1)]
            will-change-transform
          "
          style={{
            transform: `translateX(calc(50% - ${CARD_WIDTH / 2}px - ${index * STEP}px))`
          }}
        >
          {items.map((item, i) => (
            <div
              key={item._id}
              className="shrink-0"
              style={{ width: CARD_WIDTH, marginRight: GAP }}
            >
              <PairingCard
                item={item}
                active={i === index}
                offset={i - index}
              />
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="
            absolute left-2 top-1/2 -translate-y-1/2
            z-10
            rounded-full p-2
            bg-white/80 dark:bg-neutral-900/80
            backdrop-blur
            border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-500
            transition hover:scale-105
          "
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={next}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            z-10
            rounded-full p-2
            bg-white/80 dark:bg-neutral-900/80
            backdrop-blur
            border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-500
            transition hover:scale-105
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}

export default PairingRow
