const express = require('express')
const router = express.Router()
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorController')
const { protect, requireAdmin } = require('../middleware/auth')

router.get('/', getAuthors)
router.get('/:id', getAuthor)
router.post('/', protect, requireAdmin, createAuthor)
router.put('/:id', protect, updateAuthor)
router.delete('/:id', protect, requireAdmin, deleteAuthor)

module.exports = router
