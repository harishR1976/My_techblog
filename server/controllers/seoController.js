const Article = require('../models/Article')
const Category = require('../models/Category')

const formatDate = (date) => {
  return new Date(date || Date.now()).toISOString().split('T')[0]
}

const getSitemap = async (req, res, next) => {
  try {
    const protocol = req.protocol
    const host = req.get('host')
    const baseUrl = process.env.SITE_URL || process.env.CLIENT_URL || `${protocol}://${host}`

    const categories = await Category.find().select('slug updatedAt')
    const posts = await Article.find({ status: 'published' }).select('slug updatedAt createdAt')

    const today = formatDate()

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>1.0</priority>\n`
    xml += `  </url>\n`

    xml += `  <url>\n`
    xml += `    <loc>${baseUrl}/blog</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>0.9</priority>\n`
    xml += `  </url>\n`

    for (const cat of categories) {
      const catDate = formatDate(cat.updatedAt)
      xml += `  <url>\n`
      xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`
      xml += `    <lastmod>${catDate}</lastmod>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += `  </url>\n`
    }

    for (const post of posts) {
      const postDate = formatDate(post.updatedAt || post.createdAt)
      xml += `  <url>\n`
      xml += `    <loc>${baseUrl}/posts/${post.slug}</loc>\n`
      xml += `    <lastmod>${postDate}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.7</priority>\n`
      xml += `  </url>\n`
    }

    xml += `</urlset>`

    res.header('Content-Type', 'application/xml')
    return res.status(200).send(xml)
  } catch (error) {
    next(error)
  }
}

const getRobots = (req, res) => {
  const protocol = req.protocol
  const host = req.get('host')
  const baseUrl = process.env.SITE_URL || process.env.CLIENT_URL || `${protocol}://${host}`

  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n')

  res.header('Content-Type', 'text/plain')
  return res.status(200).send(robots)
}

module.exports = {
  getSitemap,
  getRobots,
}
