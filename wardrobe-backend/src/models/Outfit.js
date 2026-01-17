import mongoose from 'mongoose'

const outfitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    /* ======================
       Linked wardrobe items
    ====================== */
    items: {
      top: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WardrobeItem',
        required: true
      },
      bottom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WardrobeItem',
        required: true
      },
      footwear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WardrobeItem',
        required: true
      }
    },

    /* ======================
       Context
    ====================== */
    occasion: {
      type: String,
      trim: true
    },

    notes: {
      type: String,
      maxlength: 500
    },

    /* ======================
       Usage tracking
    ====================== */
    wearCount: {
      type: Number,
      default: 1
    },

    lastWornAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

outfitSchema.index({ userId: 1, createdAt: -1 })

const Outfit = mongoose.model('Outfit', outfitSchema)
export default Outfit
