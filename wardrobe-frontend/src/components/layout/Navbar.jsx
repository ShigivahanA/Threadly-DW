import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import ProfileMenu from '../ui/ProfileMenu'
import { logo } from '../../../assets/assets'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`
        sticky top-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? `
              backdrop-blur-xl
              bg-white/80 dark:bg-neutral-950/75
              border-b border-neutral-200/60 dark:border-neutral-800/60
            `
            : 'bg-transparent'
        }
      `}
    >
      <nav className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            className="
              flex items-center gap-2
              transition-opacity
              hover:opacity-90
            "
          >
            <img src={logo} alt="Wardrobe" className="h-7 w-auto" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-10 text-sm">
            <NavItem to="/upload">Upload</NavItem>
            <NavItem to="/wardrobe">Wardrobe</NavItem>
            <NavItem to="/pairing">Pairing</NavItem>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ProfileMenu />

            {/* Mobile toggle */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(v => !v)}
              className="
                md:hidden
                h-9 w-9
                flex items-center justify-center
                rounded-full
                transition
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                active:scale-95
              "
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all duration-300
          ${
            menuOpen
              ? 'max-h-64 opacity-100'
              : 'max-h-0 opacity-0'
          }
        `}
      >
        <div
          className="
            px-6 pt-4 pb-6
            bg-white/90 dark:bg-neutral-950/90
            backdrop-blur-xl
            border-t border-neutral-200 dark:border-neutral-800
          "
        >
          <div className="flex flex-col gap-4 text-sm">
            <MobileNavItem to="/upload" onClick={() => setMenuOpen(false)}>
              Upload
            </MobileNavItem>
            <MobileNavItem to="/wardrobe" onClick={() => setMenuOpen(false)}>
              Wardrobe
            </MobileNavItem>
            <MobileNavItem to="/pairing" onClick={() => setMenuOpen(false)}>
              Pairing
            </MobileNavItem>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar


const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
        relative py-1
        transition-colors duration-200
        ${
          isActive
            ? 'text-neutral-900 dark:text-neutral-100'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }
        after:absolute after:left-0 after:-bottom-1
        after:h-[1.5px] after:w-full
        after:origin-left after:scale-x-0
        after:bg-current
        after:transition-transform after:duration-300
        ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'}
      `
    }
  >
    {children}
  </NavLink>
)


const MobileNavItem = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="
      py-2
      text-neutral-700 dark:text-neutral-300
      transition
      hover:translate-x-1
      hover:text-neutral-900 dark:hover:text-neutral-100
    "
  >
    {children}
  </Link>
)
const HamburgerIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    className="
      h-5 w-5
      text-neutral-800 dark:text-neutral-200
      transition-colors duration-200
    "
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
          className="transition-all duration-200"
        />
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
          className="transition-all duration-200"
        />
      </>
    ) : (
      <>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </>
    )}
  </svg>
)
