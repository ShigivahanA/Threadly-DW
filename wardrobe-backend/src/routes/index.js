import express from 'express'
import authRoutes from './authRoutes.js'
import wardrobeRoutes from './wardrobeRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import homeRoutes from './homeRoutes.js'
import outfitRoutes from './outfitRoutes.js'
import conatactRoutes from './contactRoutes.js'
import profileRoutes from './profileRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/wardrobe', wardrobeRoutes)
router.use('/uploads', uploadRoutes)
router.use('/home', homeRoutes)
router.use('/outfits', outfitRoutes)
router.use('/contact', conatactRoutes)
router.use('/profile', profileRoutes)


export default router
