const mongoose = require('mongoose')
const slugify = require('slugify')

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a tag name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

tagSchema.pre('save', function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

module.exports = mongoose.model('Tag', tagSchema)
