const multer = require('multer');

const storage = multer.memoryStorage(); // ✅ In-memory, no disk file

const upload = multer({
  storage});

module.exports = upload;
