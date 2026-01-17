const Terms = () => {
  return (
    <main className="px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-10">

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold dark:text-neutral-500">
            Terms of Service
          </h1>

          <p className="text-sm text-neutral-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <Section
          title="Using the service"
          text="By using this application, you agree to use it respectfully and lawfully. This service exists to help manage personal wardrobe data."
        />

        <Section
          title="Your responsibility"
          text="You are responsible for the content you upload. Do not upload content you do not own or have rights to."
        />

        <Section
          title="Service availability"
          text="We strive for reliability, but the service is provided as-is. Features may evolve as the product grows."
        />

        <Section
          title="Account termination"
          text="You may stop using the service at any time. We reserve the right to suspend accounts used for abuse or unlawful activity."
        />

        <Section
          title="Contact"
          text="Questions about these terms are welcome. Transparency matters more than fine print."
        />
      </div>
    </main>
  )
}

export default Terms

const Section = ({ title, text }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-medium dark:text-neutral-500">
      {title}
    </h2>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      {text}
    </p>
  </section>
)
