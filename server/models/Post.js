const mongoose = require('mongoose')
const slugify = require('slugify')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    authorName: {
      type: String,
      default: 'Community Writer',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'unpublished'],
      default: 'published',
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

postSchema.pre('save', function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length
    this.readingTime = Math.max(1, Math.ceil(words / 200))
  }
})

module.exports = mongoose.model('Post', postSchema)
