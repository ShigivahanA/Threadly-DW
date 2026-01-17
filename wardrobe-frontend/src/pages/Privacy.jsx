const Privacy = () => {
  return (
    <main className="px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-10">

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold dark:text-neutral-500">
            Privacy Policy
          </h1>

          <p className="text-sm text-neutral-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <Section
          title="Our philosophy"
          text="This product is built around personal ownership and privacy. Your wardrobe data exists to serve you — not advertisers, algorithms, or external platforms."
        />

        <Section
          title="What we collect"
          text="We collect only what is necessary for the app to function: account credentials, wardrobe items you add, and outfits you choose to save."
        />

        <Section
          title="What we do not do"
          text="We do not sell your data. We do not track you across the web. We do not inject advertisements or recommendation engines without your consent."
        />

        <Section
          title="Data storage"
          text="Your data is securely stored and tied only to your account. You may delete items or your entire account at any time."
        />

        <Section
          title="Contact"
          text="If you have questions or concerns about privacy, reach out directly. We believe privacy conversations should be human."
        />
      </div>
    </main>
  )
}

export default Privacy

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
