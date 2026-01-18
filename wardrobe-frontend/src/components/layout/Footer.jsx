import { Link } from 'react-router-dom'
import { logo } from '../../../assets/assets'

const Footer = () => {
  return (
    <footer
      className="
        mt-30
        border-t
        border-neutral-200 dark:border-neutral-700
        bg-neutral-50 dark:bg-black
      "
    >
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-14">

        {/* Top: Brand + philosophy */}
        <div className="max-w-xl space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Wardrobe"
              className="h-8 w-auto opacity-90"
            />
          </div>

          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            A private digital space designed to help you understand what you own,
reuse it intentionally, and move away from excess.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">

          {/* Navigation */}
          <FooterGroup title="Explore">
            <FooterLink to="/wardrobe">Wardrobe</FooterLink>
            <FooterLink to="/pairing">Pair outfits</FooterLink>
            <FooterLink to="/outfit-folders">Saved outfits</FooterLink>
            <FooterLink to="/favourites">Favourites</FooterLink>
          </FooterGroup>

          {/* Company */}
          <FooterGroup title="Company">
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </FooterGroup>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              Get in touch
            </h4>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Feedback, thoughts, or questions are always welcome.
            </p>

            <a
              href="mailto:support@wardrobe.app"
              className="
                inline-block
                text-sm font-medium
                text-neutral-900 dark:text-neutral-100
                underline underline-offset-4
                decoration-neutral-400
                hover:decoration-neutral-900
                dark:hover:decoration-neutral-100
              "
            >
              support@threadly.app
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex flex-col gap-4
            border-t
            border-neutral-200 dark:border-neutral-800
            pt-8
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Threadly
          </p>

          <p className="text-xs text-neutral-400">
            Built slowly. Designed deliberately.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer

/* ======================
   Local helpers
====================== */

const FooterGroup = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="text-xs uppercase tracking-[0.25em] text-neutral-400">
      {title}
    </h4>
    <ul className="space-y-2">{children}</ul>
  </div>
)

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="
        text-sm
        text-neutral-600 dark:text-neutral-400
        hover:text-neutral-900 dark:hover:text-neutral-100
        transition
      "
    >
      {children}
    </Link>
  </li>
)
