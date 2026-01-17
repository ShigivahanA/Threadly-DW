import AppError from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/jwt.js'

const auth = (req, res, next) => {
  let token

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Authentication required', 401))
  }

  try {
    const decoded = verifyAccessToken(token)
    req.user = {
        id: decoded.userId,
        sessionId: decoded.sid
      }
    next()
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401))
  }
}

export default auth
