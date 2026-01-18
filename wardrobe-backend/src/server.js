import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

import routes from './routes/index.js'
import connectDB from './config/db.js'
import { generalLimiter } from './middleware/rateLimit.js'
import errorHandler from './middleware/error.js'
import AppError from './utils/AppError.js'

const app = express()

/* ======================
   Vercel / Proxy config
====================== */
app.set('trust proxy', 1)

/* ======================
   Global Middleware
====================== */
app.use(helmet())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://threadly-dw-frontend.vercel.app'
]

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// ✅ Preflight must use SAME options
app.options(/.*/, cors(corsOptions))


app.use(express.json({ limit: '10kb' }))
app.use(generalLimiter)

/* ======================
   Health check
====================== */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Threadly API running'
  })
})

/* ======================
   Routes
   IMPORTANT:
   ❌ DO NOT prefix /api here
   Vercel already provides /api
====================== */
app.use('/', routes)

/* ======================
   404 Handler
====================== */
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404))
})

/* ======================
   Error Handler
====================== */
app.use(errorHandler)

/* ======================
   MongoDB (cached)
====================== */
async function ensureDB() {
  if (mongoose.connection.readyState !== 1) {
    await connectDB()
  }
}

/* ======================
   Export for Vercel
====================== */
export default async function handler(req, res) {
  await ensureDB()
  return app(req, res)
}

/* ======================
   Local development support
====================== */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
}
