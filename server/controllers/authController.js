const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Helper function to sign JWT
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'techblog_jwt_secret_key_2026_secure'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign({ id, role }, secret, { expiresIn })
}

/**
 * @desc    Authenticate admin/user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const email = req.body.email || req.body.username;
    const { password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Wrong password.',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all authors/users
 * @route   GET /api/users or GET /api/authors
 * @access  Public
 */
const getAuthors = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
      authors: users,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create a new author
 * @route   POST /api/users or POST /api/authors
 * @access  Private
 */
const createAuthor = async (req, res, next) => {
  try {
    const { name, email, password, role, bio, avatar, socialLinks } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to create an author.',
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      })
    }

    const newAuthor = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password || 'author123',
      role: role || 'author',
      bio: bio || '',
      avatar: avatar || '',
      socialLinks: socialLinks || {},
    })

    return res.status(201).json({
      success: true,
      message: 'Author created successfully.',
      author: {
        id: newAuthor._id,
        name: newAuthor.name,
        email: newAuthor.email,
        role: newAuthor.role,
        bio: newAuthor.bio,
        avatar: newAuthor.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update author profile
 * @route   PUT /api/users/:id or PUT /api/authors/:id
 * @access  Private
 */
const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email, bio, avatar, role, socialLinks } = req.body

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    if (name) user.name = name.trim()
    if (email) user.email = email.toLowerCase().trim()
    if (bio !== undefined) user.bio = bio
    if (avatar !== undefined) user.avatar = avatar
    if (role) user.role = role
    if (socialLinks) user.socialLinks = socialLinks

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Author profile updated successfully.',
      author: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete author
 * @route   DELETE /api/users/:id or DELETE /api/authors/:id
 * @access  Private
 */
const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Author not found.',
      })
    }

    await User.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'Author removed successfully.',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Seed default admin user if none exists in database
 */
const seedDefaultAdmin = async () => {
  try {
    const count = await User.countDocuments()
    if (count === 0) {
      const email = (
        process.env.ADMIN_EMAIL ||
        process.env.DEFAULT_ADMIN_EMAIL ||
        'admin@companyblog.com'
      ).toLowerCase().trim()
      const password =
        process.env.ADMIN_PASSWORD ||
        process.env.DEFAULT_ADMIN_PASSWORD ||
        'Admin@12345'
      const name = process.env.DEFAULT_ADMIN_NAME || 'Admin'

      await User.create({
        name,
        email,
        password,
        role: 'admin',
        bio: 'Senior Technical Editor & Platform Administrator',
      })
      console.log(`[Seed] Default administrator account created: ${email}`)
    }
  } catch (error) {
    console.error('[Seed] Administrator seeding failed:', error.message)
  }
}

module.exports = {
  login,
  getMe,
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  seedDefaultAdmin,
}
