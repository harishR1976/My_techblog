const express = require('express')
const router = express.Router()
const {
  login,
  getMe,
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Authentication endpoints
router.post('/login', login)
router.get('/me', protect, getMe)

// Authors/Users management endpoints
router.get('/users', getAuthors)
router.post('/users', protect, createAuthor)
router.put('/users/:id', protect, updateAuthor)
router.delete('/users/:id', protect, deleteAuthor)

router.get('/authors', getAuthors)
router.post('/authors', protect, createAuthor)
router.put('/authors/:id', protect, updateAuthor)
router.delete('/authors/:id', protect, deleteAuthor)

module.exports = router
