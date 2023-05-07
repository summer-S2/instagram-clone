// IMPORT MODULES 
const express = require('express'); // 프레임워크
const createError = require('http-errors'); // 에러처리
const cookieParser = require('cookie-parser'); // 클라이언트가 전송하는 쿠키를 파싱하기 위해서 필요
const logger = require('morgan'); // 애플리케이션에서 로그를 기록하는 모듈
const cors = require("cors"); // 교차 출처 리소스 공유 : 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제, 서버가 cors를 실행해야 클라이언트가 요청할 수 있음
const indexRouter = require('./routes/index'); // 요청 url에 적절한 컨트롤러를 호출하는 역할
const app = express();
const mongoose = require("mongoose"); // 몽고db와 익스프레스는 연결하는 자바스크립트 객체지향 프로그래밍 라이브러리
const compression = require('compression'); // 라우터를 압축하는 모듈
const helmet = require('helmet'); // HTTP header를 보호하기 위해서 사용 (보안관련)
require('dotenv').config(); // 환경변수를 사용할 수 있게 해줌

// DATABASE Connection (데이터베이스 연결)
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .catch(err => console.log(err));

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet.crossOriginResourcePolicy({
  policy: "cross-origin" 
}));
app.use(compression()); // Compress all routes
app.use(cors());

// set static path in this app. (정적 경로 저장)
app.use('/api/static', express.static('public'));
app.use('/api/files', express.static('files'));

// ROUTER
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err); // 콘솔에 에러 띄움
  res.status(err.status || 500).json(err); // 클라이언트에게 에러 객체 전송
})

module.exports = app;
