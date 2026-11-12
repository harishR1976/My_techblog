const slugify = require('slugify')
const Post = require('../models/Post')

const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = { status: 'published' }

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i')
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: posts.length, posts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    let post = await Post.findOne({ slug, status: 'published' })

    if (!post && slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findOne({ _id: slug, status: 'published' })
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    post.views += 1
    await post.save()

    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const createPublicPost = async (req, res) => {
  try {
    const { title, content, shortDescription, category, authorName, featuredImage } = req.body

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' })
    }

    let baseSlug = slugify(title, { lower: true, strict: true })
    if (!baseSlug) baseSlug = 'post'

    let slug = baseSlug
    let counter = 1
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const summary = shortDescription || content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'

    const post = new Post({
      title: title.trim(),
      slug,
      shortDescription: summary.trim(),
      content,
      category: category || 'General',
      authorName: authorName ? authorName.trim() : 'Community Writer',
      featuredImage: featuredImage || '',
      status: 'published',
      isFeatured: false,
      views: 0,
    })

    const savedPost = await post.save()
    res.status(201).json({ success: true, post: savedPost })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAdminPosts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: posts.length, posts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getAdminPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getPosts,
  getPostBySlug,
  createPublicPost,
  getAdminPosts,
  getAdminPostById,
  updatePost,
  deletePost,
}
