import { Routes, Route } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PublicRoute from './components/layout/PublicRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Wardrobe from './pages/Wardrobe'
import Favourites from './pages/Favourites'
import Pairing from './pages/Pairing'
import Outfit from './pages/Outfit'
import Privacy from './pages/Privacy'
import OutfitFolders from './pages/OutfitFolders'
import WardrobeItem from './pages/WardrobeItem'
import Upload from './pages/Upload'
import OutfitDetail from './pages/OutfitDetail'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Profile from './pages/Profile'


const App = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Protected pages */}
        <Route
          path="/wardrobe"
          element={
            <ProtectedRoute>
              <Wardrobe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wardrobe/:id"
          element={
            <ProtectedRoute>
              <WardrobeItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pairing"
          element={
            <ProtectedRoute>
              <Pairing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/outfit"
          element={
            <ProtectedRoute>
              <Outfit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/outfit-folders"
          element={
            <ProtectedRoute>
              <OutfitFolders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/outfits/:id"
          element={
            <ProtectedRoute>
              <OutfitDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  )
}

export default App
