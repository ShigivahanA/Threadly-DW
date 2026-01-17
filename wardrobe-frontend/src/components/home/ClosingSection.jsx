import { Link } from 'react-router-dom'

const ClosingSection = () => {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl text-center space-y-10">

        {/* Divider */}
        <div
          className="
            mx-auto h-px max-w-40 min-w-30
            bg-neutral-300 dark:bg-neutral-700
          "
        />

        {/* Statement */}
        <p
          className="
            text-lg sm:text-xl
            text-neutral-600 dark:text-neutral-400
            leading-relaxed
          "
        >
          Style isn’t about having more.
          <br />
          It’s about knowing what’s enough.
        </p>

        {/* Signature line */}
        <p
          className="
            text-sm uppercase tracking-[0.3em]
            text-neutral-400 dark:text-neutral-500
          "
        >
          A wardrobe, considered
        </p>

        {/* Gentle CTA */}
        <div className="pt-6">
          <Link
            to="/register"
            className="
              inline-flex items-center gap-2
              text-sm font-medium
              text-neutral-800 dark:text-neutral-200
              underline underline-offset-4
              decoration-neutral-400 dark:decoration-neutral-600
              transition
              hover:decoration-neutral-800 dark:hover:decoration-neutral-200
            "
          >
            Begin quietly
          </Link>
        </div>

      </div>
    </section>
  )
}

export default ClosingSection
