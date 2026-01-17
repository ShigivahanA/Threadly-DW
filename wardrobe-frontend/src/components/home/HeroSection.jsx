import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import HeroSkeleton from './HeroSkeleton'

const HeroSection = () => {
  const { isAuthenticated } = useAuth()
  const [ready, setReady] = useState(false)

  // intentional reveal
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 450)
    return () => clearTimeout(t)
  }, [])

  if (!ready) {
    return <HeroSkeleton />
  }

  return (
    <section className="px-4 pb-8">
      <div className="mx-auto max-w-4xl space-y-10 text-center">

        {/* Eyebrow */}
        <p
          className="
            text-xs uppercase tracking-[0.25em]
            text-neutral-400 dark:text-neutral-500
          "
        >
          A private wardrobe space
        </p>

        {/* Headline */}
        <h1
          className="
            text-4xl sm:text-5xl md:text-6xl
            font-semibold
            tracking-tight
            leading-[1.05] dark:text-neutral-500
          "
        >
          Dress with
          <span className="block">intention</span>
        </h1>

        {/* Subtext */}
        <p
          className="
            max-w-2xl mx-auto
            text-neutral-500 dark:text-neutral-400
            text-base sm:text-lg
            leading-relaxed
          "
        >
          A calm, personal place to understand what you own,
          build outfits thoughtfully, and repeat them without guilt.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/wardrobe"
                className="
                  rounded-full px-7 py-3
                  bg-black text-white
                  dark:bg-neutral-500 dark:text-black
                  font-medium
                  transition
                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                Open wardrobe
              </Link>

              <Link
                to="/pairing"
                className="
                  rounded-full px-7 py-3
                  border
                  border-neutral-300 dark:border-neutral-700
                  text-neutral-700 dark:text-neutral-300
                  font-medium
                  transition
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                "
              >
                Build an outfit
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="
                  rounded-full px-7 py-3
                  bg-black text-white
                  dark:bg-white dark:text-black
                  font-medium
                  transition
                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                Start your wardrobe
              </Link>

              <Link
                to="/login"
                className="
                  rounded-full px-7 py-3
                  border
                  border-neutral-300 dark:border-neutral-700
                  text-neutral-700 dark:text-neutral-300
                  font-medium
                  transition
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                "
              >
                Sign in
              </Link>
            </>
          )}
        </div>

      </div>
    </section>
  )
}

export default HeroSection
