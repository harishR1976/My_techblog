const express = require('express')
const router = express.Router()
const requireAdmin = require('../middleware/requireAdmin')
const {
  getPosts,
  getPostBySlug,
  createPublicPost,
  getAdminPosts,
  getAdminPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController')

// Admin endpoints
router.get('/admin/all', requireAdmin, getAdminPosts)
router.get('/admin/:id', requireAdmin, getAdminPostById)

// Public routes
router.get('/', getPosts)
router.get('/:slug', getPostBySlug)
router.post('/', createPublicPost)

// Update and delete
router.put('/:id', requireAdmin, updatePost)
router.delete('/:id', requireAdmin, deletePost)

module.exports = router
