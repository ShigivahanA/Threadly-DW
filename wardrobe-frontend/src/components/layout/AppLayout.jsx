import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ScrollToTop from './ScrollToTop'

const AppLayout = ({ children }) => {
  const { pathname } = useLocation()
  const { loading } = useAuth()

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')

  /**
   * 🔒 CRITICAL:
   * Wait for auth bootstrap before rendering layout
   * Prevents navbar from flashing logged-out state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900" />
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />

      <main
        className={
          isAuthPage
            ? ''
            : 'mx-auto max-w-5xl px-4 pt-6'
        }
      >
        <ScrollToTop />
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default AppLayout
