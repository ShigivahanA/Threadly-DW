import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    refreshTokenId: {
      type: String,
      required: true
    },

    device: {
      type: String,
      default: 'Unknown device'
    },

    ip: {
      type: String,
      default: 'Unknown'
    },

    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
)

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    name: {
      type: String,
      trim: true
    },
    
    otp: {
      code: { type: String },
      expiresAt: { type: Date }
    },

    sessions: [sessionSchema],

    passwordReset: {
      token: { type: String },
      expiresAt: { type: Date }
    },

    avatarUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

// Index for fast login lookup
userSchema.index({ email: 1 })

const User = mongoose.model('User', userSchema)

export default User
