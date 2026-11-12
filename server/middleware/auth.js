const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    })
  }

  try {
    const secret = process.env.JWT_SECRET || 'techblog_jwt_secret_key_2026_secure'
    const decoded = jwt.verify(token, secret)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    })
  }
}

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator privileges required.',
    })
  }
  next()
}

module.exports = {
  protect,
  requireAdmin,
}
