const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { protect } = require('../middleware/auth')

router.post('/', protect, upload.any(), (req, res) => {
  const uploadedFile = req.files && req.files.length > 0 ? req.files[0] : req.file

  if (!uploadedFile) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded. Please select an image.',
    })
  }

  const url = `/uploads/${uploadedFile.filename}`

  return res.status(200).json({
    success: true,
    url,
    filename: uploadedFile.filename,
  })
})

module.exports = router
