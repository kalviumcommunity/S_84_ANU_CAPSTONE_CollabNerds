const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folder exists
const uploadPath = 'uploads/profile_images/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.heic'].includes(ext)) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
