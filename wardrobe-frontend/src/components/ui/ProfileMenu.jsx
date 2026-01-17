import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProfileMenu = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        aria-label="Open profile menu"
        className="
          h-9 w-9
          flex items-center justify-center
          rounded-full
          text-neutral-700 dark:text-neutral-300
          hover:bg-neutral-100 dark:hover:bg-neutral-800
          transition
        "
      >
        <ProfileIcon />
      </button>

      {/* Hover bridge */}
      <div className="absolute right-0 top-full h-3 w-12" />

      {/* Menu */}
      <div
        className="
          absolute right-0 top-full mt-3
          w-48
          rounded-2xl
          border
          border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-neutral-950
          shadow-[0_12px_40px_-20px_rgba(0,0,0,0.25)]
          opacity-0 translate-y-1
          pointer-events-none
          transition-all duration-200
          group-hover:opacity-100
          group-hover:translate-y-0
          group-hover:pointer-events-auto
        "
      >
        <div className="py-2">

          {isAuthenticated ? (
            <>
            <MenuLink to="/profile">Profile</MenuLink>
              <MenuLink to="/outfit-folders">Saved outfits</MenuLink>
              <MenuLink to="/favourites">Favourites</MenuLink>

              <Divider />

              <button
                onClick={handleLogout}
                className="
                  w-full px-4 py-2
                  text-left text-sm
                  text-red-600 dark:text-neutral-400
                  hover:text-neutral-900 dark:hover:text-neutral-100
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                  transition
                "
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <MenuLink to="/login">Sign in</MenuLink>
              <MenuLink to="/register">Create account</MenuLink>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProfileMenu

/* ======================
   Local components
====================== */

const MenuLink = ({ to, children }) => (
  <Link
    to={to}
    className="
      block px-4 py-2
      text-sm
      text-neutral-700 dark:text-neutral-300
      hover:text-neutral-900 dark:hover:text-neutral-100
      hover:bg-neutral-100 dark:hover:bg-neutral-800
      transition
    "
  >
    {children}
  </Link>
)

const Divider = () => (
  <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />
)

const ProfileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-5 w-5"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c0-3.5 3.5-5.5 7.5-5.5s7.5 2 7.5 5.5" />
  </svg>
)
