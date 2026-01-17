import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import routes from './routes/index.js'
import { generalLimiter } from './middleware/rateLimit.js'
import errorHandler from './middleware/error.js'
import AppError from './utils/AppError.js'

const app = express()

/* ======================
   Global Middleware
====================== */

// Security headers
app.use(helmet())

// CORS (tighten later if needed)
app.use(
  cors({
    origin: true,
    credentials: true
  })
)

// Body parsing
app.use(express.json({ limit: '10kb' }))

// General rate limiting
app.use(generalLimiter)

/* ======================
   Routes
====================== */

app.use('/api', routes)

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

export default app
