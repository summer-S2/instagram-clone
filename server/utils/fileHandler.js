const multer = require('multer');
const path = require('path');

module.exports = function fileHandler(dest) {
  const upload = multer({
    // storage 속성 : 저장공간, 파일이름
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${__dirname}/../files/${dest}/`) //__dirname: 현재파일의 경로를 리턴하는 변수
      },
  
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // 확장자 가져오기
        cb(null, Date.now() + ext) // Date.now함수로 랜덤 파일 이름 생성 + 확장자
      }
    }),

    // 파일 필터링
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
  
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') { // 이미지파일만 가능
        return cb(null, true)
      }
  
      cb(new TypeError('Not acceptable type of files.'));
    },

    // 파일 사이즈, 개수 제한
    limits: {
      fileSize: 1e7, // 10mb
      files: 10 // 최대 10개까지만
    }
  })

  return upload;
}