import express from 'express'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  addItem,
  getItems,
  getItemById,
  deleteItem,
  updateItem,
  toggleFavorite
} from '../controllers/wardrobeController.js'
import { z } from 'zod'

const router = express.Router()

const addItemSchema = z.object({
  body: z.object({
    imageUrl: z.string().url(),
    imagePublicId: z.string(),
    category: z.enum([
      'shirt',
      'tshirt',
      'pant',
      'jeans',
      'jacket',
      'shoes',
      'other'
    ]),
    colors: z.array(z.string()).optional(),
    size: z.string().optional(),
    brand: z.string().optional(),
    occasion: z.enum([
      'casual',
      'formal',
      'party',
      'ethnic',
      'sports',
      'other'
    ]).optional(),
    season: z.enum(['summer', 'winter', 'all']).optional(),
    isFavorite: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(500).optional()
  })
})

const updateItemSchema = z.object({
  body: z.object({
    category: z.string().optional(),
    colors: z.array(z.string()).optional(),
    season: z.enum(['summer', 'winter', 'all']).optional(),
    size: z.string().optional(),
    brand: z.string().optional(),
    occasion: z.enum([
      'casual',
      'formal',
      'party',
      'ethnic',
      'sports',
      'other'
    ]).optional(),
    isFavorite: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().max(500).optional()
  })
})


router.use(auth)

router.post('/', validate(addItemSchema), addItem)
router.get('/', getItems)
router.get('/:id', getItemById)
router.delete('/:id', deleteItem)
router.patch('/:id', validate(updateItemSchema), updateItem)
router.patch('/:id/favorite', toggleFavorite)



export default router
