const mongoose = require('mongoose')
const slugify = require('slugify')

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide an article slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.Mixed, // Can store Category ObjectId or Category name string
      default: 'General',
    },
    author: {
      type: mongoose.Schema.Types.Mixed, // Can store User ObjectId or Author name string
      default: 'Admin',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'unpublished'],
      default: 'draft',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    publishAt: {
      type: Date,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    metaTitle: {
      type: String,
      default: '',
      trim: true,
    },
    metaDescription: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-validation hook: auto-generate slug and calculate reading time
articleSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  // Calculate estimated reading time based on 200 words per minute
  if (this.content) {
    const textOnly = this.content.replace(/<[^>]*>/g, ' ')
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length
    this.readingTime = Math.max(1, Math.ceil(words / 200))
  }

  // Synchronize shortDescription and summary aliases
  if (this.shortDescription && !this.summary) {
    this.summary = this.shortDescription
  } else if (this.summary && !this.shortDescription) {
    this.shortDescription = this.summary
  }
})

module.exports = mongoose.model('Article', articleSchema)
