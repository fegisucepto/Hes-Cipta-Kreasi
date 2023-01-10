const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const MAX_SIZE = 100 * 1024 * 1024 // 20mb

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
})

module.exports = {
  upload,
}
