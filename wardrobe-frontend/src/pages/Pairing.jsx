import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import wardrobeService from '../services/wardrobeService'

import PairingRow from '../components/pairing/PairingRow'
import PairingSkeleton from '../components/pairing/PairingSkeleton'

const TOPS = ['shirt', 'tshirt', 'jacket']
const BOTTOMS = ['pant', 'jeans']
const FOOTWEAR = ['shoes']

const normalize = (v) => v?.toLowerCase().trim()

const Pairing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [tops, setTops] = useState([])
  const [bottoms, setBottoms] = useState([])
  const [footwear, setFootwear] = useState([])

  // ✅ Selected outfit pieces
  const [top, setTop] = useState(null)
  const [bottom, setBottom] = useState(null)
  const [shoe, setShoe] = useState(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await wardrobeService.getItems()
        const items = res?.items ?? []

        if (!mounted) return

        setTops(items.filter(i => TOPS.includes(normalize(i.category))))
        setBottoms(items.filter(i => BOTTOMS.includes(normalize(i.category))))
        setFootwear(items.filter(i => FOOTWEAR.includes(normalize(i.category))))
      } catch {
        if (mounted) {
          setTops([])
          setBottoms([])
          setFootwear([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <PairingSkeleton />

  const canProceed = top && bottom && shoe

  const goToOutfit = () => {
    navigate('/outfit', {
      state: { top, bottom, shoe }
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-14">
      <h1 className="text-2xl font-semibold text-center dark:text-neutral-500">
        Build an Outfit
      </h1>

      <PairingRow title="Top" items={tops} onChange={setTop} />
      <PairingRow title="Bottom" items={bottoms} onChange={setBottom} />
      <PairingRow title="Footwear" items={footwear} onChange={setShoe} />

      {/* CTA */}
      <div className="pt-6 flex justify-center">
        <button
          disabled={!canProceed}
          onClick={goToOutfit}
          className="
            px-6 py-3 rounded-xl
            font-medium
            transition
            bg-black text-white
            dark:bg-neutral-500 dark:text-black
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          View Outfit
        </button>
      </div>
    </div>
  )
}

export default Pairing
