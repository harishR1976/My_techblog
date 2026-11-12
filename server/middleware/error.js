const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    statusCode = 404
    message = `Resource not found with ID: ${err.value}`
  } else if (err.code === 11000) {
    statusCode = 400
    const fields = Object.keys(err.keyValue || {})
    message = `Duplicate value entered for ${fields.join(', ')}. Please use unique values.`
  } else if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
  } else if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image upload exceeds the maximum allowed file size of 5MB.'
    } else {
      message = `Upload error: ${err.message}`
    }
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication failed. Please log in again.'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = {
  notFound,
  errorHandler,
}
