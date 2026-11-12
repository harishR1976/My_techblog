const Category = require('../models/Category')
const Article = require('../models/Article')
const slugify = require('slugify')

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Article.countDocuments({
          $or: [
            { category: cat._id },
            { category: cat.name },
            { category: cat.slug },
          ],
        })
        const plain = cat.toObject()
        plain.articleCount = count
        return plain
      })
    )

    return res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    })
  } catch (error) {
    next(error)
  }
}

const getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug)

    const category = isObjectId
      ? await Category.findById(idOrSlug)
      : await Category.findOne({ slug: idOrSlug.toLowerCase() })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }

    const count = await Article.countDocuments({
      $or: [
        { category: category._id },
        { category: category.name },
        { category: category.slug },
      ],
    })

    const result = category.toObject()
    result.articleCount = count

    return res.status(200).json({
      success: true,
      category: result,
    })
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      })
    }

    const trimmedName = name.trim()
    const targetSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(trimmedName, { lower: true, strict: true })

    const existing = await Category.findOne({
      $or: [{ name: trimmedName }, { slug: targetSlug }],
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists.',
      })
    }

    const category = await Category.create({
      name: trimmedName,
      slug: targetSlug,
      description: description ? description.trim() : '',
    })

    return res.status(201).json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, slug, description } = req.body

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }

    if (name) {
      category.name = name.trim()
      if (!slug) {
        category.slug = slugify(category.name, { lower: true, strict: true })
      }
    }

    if (slug) {
      category.slug = slugify(slug, { lower: true, strict: true })
    }

    if (description !== undefined) {
      category.description = description.trim()
    }

    await category.save()

    return res.status(200).json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }

    const postCount = await Article.countDocuments({
      $or: [
        { category: category._id },
        { category: category.name },
        { category: category.slug },
      ],
    })

    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because ${postCount} post(s) are currently assigned to it. Reassign or delete those posts first.`,
      })
    }

    await Category.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    })
  } catch (error) {
    next(error)
  }
}

const seedDefaultCategories = async () => {
  const initialCategories = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest news, hardware, gadget reviews, and emerging tech trends.',
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern frontend, backend, fullstack frameworks, and web architectures.',
    },
    {
      name: 'Design & UI',
      slug: 'design-ui',
      description: 'UI/UX design principles, responsive design systems, and typography.',
    },
    {
      name: 'Tutorials',
      slug: 'tutorials',
      description: 'Step-by-step hands-on developer guides and coding walkthroughs.',
    },
    {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      description: 'Machine learning, LLMs, neural networks, and generative AI innovations.',
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      description: 'Workflows, developer tooling, automation, and efficiency strategies.',
    },
    {
      name: 'General',
      slug: 'general',
      description: 'General discussions, industry insights, and editorial opinions.',
    },
  ]

  try {
    const count = await Category.countDocuments()
    if (count === 0) {
      await Category.insertMany(initialCategories)
      console.log(`[Seed] Successfully seeded ${initialCategories.length} default categories.`)
    }
  } catch (error) {
    console.error('[Seed] Category seeding failed:', error.message)
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  seedDefaultCategories,
}
