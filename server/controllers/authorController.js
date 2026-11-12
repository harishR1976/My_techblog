const User = require('../models/User')
const Article = require('../models/Article')

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })

    const authorsWithCount = await Promise.all(
      authors.map(async (author) => {
        const count = await Article.countDocuments({
          $or: [
            { author: author._id },
            { author: author.name },
            { author: author.email },
          ],
        })
        const plain = author.toObject()
        plain.articleCount = count
        return plain
      })
    )

    return res.status(200).json({
      success: true,
      count: authorsWithCount.length,
      authors: authorsWithCount,
      users: authorsWithCount,
    })
  } catch (error) {
    next(error)
  }
}

const getAuthor = async (req, res, next) => {
  try {
    const { id } = req.params
    const author = await User.findById(id).select('-password')

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    const posts = await Article.find({
      status: 'published',
      $or: [
        { author: author._id },
        { author: author.name },
        { author: author.email },
      ],
    })
      .sort({ createdAt: -1 })
      .select('title slug shortDescription featuredImage createdAt readingTime')

    const authorData = author.toObject()
    authorData.posts = posts

    return res.status(200).json({
      success: true,
      author: authorData,
    })
  } catch (error) {
    next(error)
  }
}

const createAuthor = async (req, res, next) => {
  try {
    const { name, email, password, role, bio, avatar, socialLinks } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Author name and email are required.',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: normalizedEmail })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      })
    }

    const newAuthor = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password || 'author123',
      role: role || 'author',
      bio: bio ? bio.trim() : '',
      avatar: avatar || '',
      socialLinks: socialLinks || {},
    })

    const authorResponse = newAuthor.toObject()
    delete authorResponse.password

    return res.status(201).json({
      success: true,
      author: authorResponse,
    })
  } catch (error) {
    next(error)
  }
}

const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email, password, role, bio, avatar, socialLinks } = req.body

    const author = await User.findById(id)
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    if (name) author.name = name.trim()
    if (email) author.email = email.toLowerCase().trim()
    if (role && req.user.role === 'admin') author.role = role
    if (bio !== undefined) author.bio = bio.trim()
    if (avatar !== undefined) author.avatar = avatar
    if (socialLinks !== undefined) author.socialLinks = socialLinks
    if (password && password.trim().length >= 6) {
      author.password = password
    }

    await author.save()

    const authorResponse = author.toObject()
    delete authorResponse.password

    return res.status(200).json({
      success: true,
      author: authorResponse,
    })
  } catch (error) {
    next(error)
  }
}

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user && req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active administrator account.',
      })
    }

    const author = await User.findById(id)
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    await User.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'Author deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
}
