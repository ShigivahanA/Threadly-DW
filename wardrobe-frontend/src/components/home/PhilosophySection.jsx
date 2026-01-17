const PhilosophySection = () => {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl space-y-20">

        {/* Lead philosophy */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p
            className="
              text-xs uppercase tracking-[0.3em]
              text-neutral-400 dark:text-neutral-500
            "
          >
            Philosophy
          </p>

          <h2
            className="
              text-3xl sm:text-4xl
              font-semibold
              tracking-tight
              leading-tight dark:text-neutral-500
            "
          >
            Your wardrobe already has
            <span className="block">
              everything it needs
            </span>
          </h2>

          <p
            className="
              text-base sm:text-lg
              text-neutral-500 dark:text-neutral-400
              leading-relaxed
            "
          >
            This isn’t about acquiring more.
            It’s about noticing more — what you own,
            how often you wear it, and why it matters.
          </p>
        </div>

        {/* Supporting philosophies */}
        <div className="grid gap-14 md:grid-cols-2 max-w-5xl mx-auto">

          <PhilosophyBlock
            eyebrow="Privacy"
            title="Designed to be unseen"
            desc="No ads, no trends, no algorithms nudging you.
                  Your wardrobe exists for you alone — quiet,
                  personal, and uninterrupted."
          />

          <PhilosophyBlock
            eyebrow="Intent"
            title="Repetition is not a flaw"
            desc="Outfits are meant to be worn again.
                  Track what you love, repeat without guilt,
                  and let familiarity become your signature."
            align="right"
          />

        </div>
      </div>
    </section>
  )
}

export default PhilosophySection


const PhilosophyBlock = ({
  eyebrow,
  title,
  desc,
  align = 'left'
}) => {
  return (
    <div
      className={`
        space-y-4
        ${align === 'right' ? 'md:text-right md:pt-12' : ''}
      `}
    >
      <p
        className="
          text-xs uppercase tracking-[0.25em]
          text-neutral-400 dark:text-neutral-500
        "
      >
        {eyebrow}
      </p>

      <h3
        className="
          text-xl sm:text-2xl
          font-medium
          tracking-tight dark:text-neutral-500
        "
      >
        {title}
      </h3>

      <p
        className="
          text-sm sm:text-base
          text-neutral-500 dark:text-neutral-400
          leading-relaxed
        "
      >
        {desc}
      </p>
    </div>
  )
}
