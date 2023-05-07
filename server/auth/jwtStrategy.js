const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; // 웹토큰 추출
const User = require('../models/User');

require('dotenv').config(); // 환경변수

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // 요청해더로부터
opts.secretOrKey = process.env.SECRET; // 해독할때도 시크릿키 필요

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {

    const user = await User.findOne({ username: jwt_payload.username }); // User컬렉션에서 user를 찾음(쿼리)

    if (!user) { // user가 없으면 401
      return done(null, false);
    }

    return done(null, user); // err:null, user

  } catch (err) {
    done(err, false); // err, 권한없음
  }
})

module.exports = jwtStrategy;