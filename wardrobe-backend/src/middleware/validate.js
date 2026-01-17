import AppError from '../utils/AppError.js'

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })

    next()
  } catch (error) {
    const message = error.errors?.[0]?.message || 'Invalid request'
    next(new AppError(message, 400))
  }
}

export default validate
