const express = require('express')
const router = express.Router()
const {
  getPosts,
  getPostBySlug,
  createPublicPost,
  getAdminPosts,
  getAdminPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController')

router.get('/admin/all', getAdminPosts)
router.get('/admin/:id', getAdminPostById)
router.get('/public', getPosts)
router.get('/slug/:slug', getPostBySlug)
router.get('/', getPosts)
router.get('/:slug', getPostBySlug)
router.post('/', createPublicPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)

module.exports = router
