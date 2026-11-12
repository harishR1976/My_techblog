const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /^\.(jpg|jpeg|png|webp|gif|svg)$/i
  const allowedMimeTypes = /^image\/(jpeg|png|webp|gif|svg\+xml)$/i

  const ext = path.extname(file.originalname).toLowerCase()
  const mimeTypeMatches = allowedMimeTypes.test(file.mimetype)
  const extMatches = allowedExtensions.test(ext)

  if (extMatches && mimeTypeMatches) {
    return cb(null, true)
  }

  cb(
    new Error(
      'Only image files (.jpg, .jpeg, .png, .webp, .gif, .svg) are allowed.'
    )
  )
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
})

module.exports = upload
