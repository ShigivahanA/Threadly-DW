import express from 'express'
import auth from '../middleware/auth.js'
import {
  createOutfit,
  getOutfits,
  getOutfitById,
  updateOutfit,
  incrementWear,
  deleteOutfit
} from '../controllers/outfitController.js'

const router = express.Router()

router.use(auth)

router.post('/', createOutfit)
router.get('/', getOutfits)
router.get('/:id', getOutfitById)
router.patch('/:id', updateOutfit)
router.patch('/:id/wear', incrementWear)
router.delete('/:id', deleteOutfit)

export default router
