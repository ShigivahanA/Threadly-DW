import mongoose from 'mongoose'

const wardrobeItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    /* ======================
       Image
    ====================== */
    imageUrl: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    /* ======================
       Core metadata
    ====================== */
    category: {
      type: String,
      required: true,
      enum: [
        'shirt',
        'tshirt',
        'pant',
        'jeans',
        'jacket',
        'shoes',
        'other'
      ],
      index: true
    },

    size: {
      type: String, // S, M, L, XL, 32, 34, etc.
      trim: true
    },

    colors: {
      type: [String], // hex codes or color names
      index: true
    },

    brand: {
      type: String,
      trim: true
    },

    occasion: {
      type: String,
      enum: ['casual', 'formal', 'party', 'ethnic', 'sports', 'other'],
      default: 'other'
    },

    season: {
      type: String,
      enum: ['summer', 'winter', 'all'],
      default: 'all'
    },

    /* ======================
       UX helpers
    ====================== */
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    },

    tags: {
      type: [String]
    },

    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
)

// Indexes for fast filtering
wardrobeItemSchema.index({ userId: 1, category: 1 })
wardrobeItemSchema.index({ userId: 1, colors: 1 })
wardrobeItemSchema.index({ userId: 1, isFavorite: 1 })

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeItemSchema)

export default WardrobeItem
