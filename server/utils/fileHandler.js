const multer = require('multer');
const path = require('path');

module.exports = function fileHandler(dest) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${__dirname}/../files/${dest}/`)
      },
  
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
      }
    }),
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
  
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        return cb(null, true)
      }
  
      cb(new TypeError('Not acceptable type of files.'));
    },
    limits: {
      fileSize: 1e7,
      files: 10
    }
  })

  return upload;
}