import AppError from '../utils/AppError.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log unexpected errors
  if (!err.isOperational) {
    console.error('❌ UNEXPECTED ERROR')
    console.error(err)
  }

  // Default error
  if (!error.statusCode) {
    error = new AppError('Internal server error', 500)
  }

  res.status(error.statusCode).json({
    status: error.status || 'error',
    message: error.message
  })
}

export default errorHandler
