const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

module.exports = mongoose.model('Category', categorySchema);
