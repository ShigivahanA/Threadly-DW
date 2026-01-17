export const successResponse = (res, { statusCode = 200, message, data }) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  })
}

export const errorResponse = (res, { statusCode = 500, message }) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  })
}
