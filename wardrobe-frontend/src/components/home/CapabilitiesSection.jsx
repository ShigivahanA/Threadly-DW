const CapabilitiesSection = () => {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl space-y-20">

        {/* Section intro */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p
            className="
              text-xs uppercase tracking-[0.3em]
              text-neutral-400 dark:text-neutral-500
            "
          >
            Capabilities
          </p>

          <h2
            className="
              text-3xl sm:text-4xl
              font-semibold
              tracking-tight dark:text-neutral-500
            "
          >
            Built around how you actually dress
          </h2>

          <p
            className="
              text-base sm:text-lg
              text-neutral-500 dark:text-neutral-400
              leading-relaxed
            "
          >
            No automation theater.
            No unnecessary intelligence.
            Just tools that respect your habits instead of rewriting them.
          </p>
        </div>

        {/* Capabilities layout */}
        <div className="grid gap-y-16 gap-x-12 md:grid-cols-2 max-w-5xl mx-auto">

          <Capability
            title="A digital wardrobe"
            desc="Photograph and organize what you already own —
                  not what an algorithm thinks you should buy."
          />

          <Capability
            title="Manual outfit pairing"
            desc="Pair pieces yourself, slowly.
                  Intuition beats automation when taste is personal."
          />

          <Capability
            title="Wear awareness"
            desc="Track what gets worn and what doesn’t —
                  clarity replaces clutter."
          />

          <Capability
            title="Saved combinations"
            desc="Store outfits you trust.
                  Come back to them when decision fatigue sets in."
          />

          <Capability
            title="Personal favorites"
            desc="Notice the pieces you reach for without thinking —
                  they tell you more than trends ever will."
          />

          <Capability
            title="AI — later, optionally"
            desc="The foundation is ready for intelligence,
                  but only when you decide it belongs."
          />

        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection


const Capability = ({ title, desc }) => {
  return (
    <div className="space-y-3">
      <h3
        className="
          text-lg sm:text-xl
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
