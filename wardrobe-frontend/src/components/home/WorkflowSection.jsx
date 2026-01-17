const WorkflowSection = () => {
  return (
    <section className="px-4 ">
      <div className="mx-auto max-w-5xl relative">

        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-24">
          <p
            className="
              text-xs uppercase tracking-[0.3em]
              text-neutral-400 dark:text-neutral-500
            "
          >
            The flow
          </p>

          <h2
            className="
              text-3xl sm:text-4xl
              font-semibold
              tracking-tight dark:text-neutral-500
            "
          >
            A calm daily rhythm
          </h2>

          <p
            className="
              text-base sm:text-lg
              text-neutral-500 dark:text-neutral-400
              leading-relaxed
            "
          >
            No routines to follow.
            No pressure to keep up.
            Just a natural way of living with what you already own.
          </p>
        </div>

        {/* River line */}
        <div
          className="
            absolute left-1/2 top-40 bottom-0
            w-px
            bg-gradient-to-b
            from-transparent
            via-neutral-300 dark:via-neutral-700
            to-transparent
            -translate-x-1/2
          "
        />

        {/* Flow steps */}
        <div className="space-y-28 relative">

          <FlowStep
            align="left"
            index="01"
            title="Add, slowly"
            text="Capture your clothes when you feel ready.
                  No rush. No backlog guilt."
          />

          <FlowStep
            align="right"
            index="02"
            title="Pair with intention"
            text="Build outfits only when you want to.
                  Taste emerges in quiet moments."
          />

          <FlowStep
            align="left"
            index="03"
            title="Repeat with confidence"
            text="Save what works.
                  Wear it again.
                  Let familiarity become style."
          />

        </div>
      </div>
    </section>
  )
}

export default WorkflowSection


const FlowStep = ({ index, title, text, align }) => {
  const isLeft = align === 'left'

  return (
    <div
      className={`
        relative
        flex
        ${isLeft ? 'justify-start' : 'justify-end'}
      `}
    >
      <div
        className={`
          w-full max-w-md
          ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}
        `}
      >
        {/* Index */}
        <p
          className="
            text-xs font-mono
            text-neutral-400 dark:text-neutral-500
            mb-2
          "
        >
          {index}
        </p>

        {/* Title */}
        <h3
          className="
            text-lg sm:text-xl
            font-medium
            tracking-tight
            mb-2 dark:text-neutral-500
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="
            text-sm sm:text-base
            text-neutral-500 dark:text-neutral-400
            leading-relaxed
          "
        >
          {text}
        </p>
      </div>

      {/* River node */}
      <span
        className="
          absolute left-1/2 top-3
          h-2 w-2
          rounded-full
          bg-neutral-400 dark:bg-neutral-600
          -translate-x-1/2
        "
      />
    </div>
  )
}
