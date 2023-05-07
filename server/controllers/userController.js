// 실제 요청을 처리하는 모듈(로직)
const User = require('../models/User'); //모델 4개
const Follow = require('../models/Follow');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');
const { check, vaildationResult, validationResult } = require('express-validator'); //유효성검사를 해주는 모듈

// 회원가입
exports.register = [ // 변수를 선언함과 동시에 사용
  // async가 회원가입을 처리하기 전에 입력 데이터를 확인
  check('username').isLength({ min: 5 }), // 최소 5글자
  check('email').isEmail(), // 올바른 이메일인지 express-validator가 제공하는 로직
  check('password').isLength({ min: 5 }),

  async (req, res, next) => { // 리퀘스트요청, 리스폰스응답, 넥스트함수를 호출하면 현재콜백을 빠져나감
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) { // 에러가 있으면 (유효성검사 통과x)
        const err = new Error(); // 새로운 에러 객체 생성
        err.errors = errors.array();
        err.status = 400; // 클라이언트의 잘못된 요청
        throw err;
      }

      const { email, fullName, username, password } = req.body;

      // username 중복검사
      const userByUsername = await User.findOne({ username }); // 데이터베이스 쿼리: 유저컬렉션에서 클라이언트로부터 전달받은 유저네임이 있는지 확인요청
      if (userByUsername) {
        const err = new Error('Username already in use');
        err.status = 400;
        throw err;
      }
      
      // email 중복검사
      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        const err = new Error('E-mail already in use');
        err.status = 400;
        throw err;
      }

      // 유저 생성
      const user = new User(); // 유저 스키마 생성
      user.email = email;
      user.fullName = fullName;
      user.username = username;
      user.setPassword(password);
      user.image = 'default.png'

      await user.save();

      res.json({ user }); // status 생략은 200


    } catch (error) {
      next(error) // error객체를 next 함수에 전달 -> app.js의 ERROR HANDLER에 전달
    }
  }
]; 


// 로그인
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const _user = await User.findOne({ email });

    // 유저가 존재하지 않을 경우
    if(!_user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }

    // 비밀번호가 다를 때
    if (!_user.checkPassword(password)) {
      const err = new Error('Password not match');
      err.status = 401;
      throw err;
    }

    // 토큰 발급
    const token = _user.generateJWT();

    // 유저 계정 수정할때 사용 
    const user = {
      username: _user.username,
      image: _user.image,
      email: _user.email,
      fullName: _user.fullName,
      bio: _user.bio,
      token
    }

    res.json({ user });

  } catch (error) {
    next(error);
  }
}

// 유저 검색
exports.users = async (req, res, next) => { // 리퀘스트쿼리 요청변수
  try {

    const where = {}; // 검색 조건
    const limit = req.query.limit || 10; // 한꺼번에 몇개의 데이터(row/doc)를 보내줄것인지
    const skip = req.query.skip || 0; // 몇개의 데이터를 건너뛰고 보낼것인지

    // 유저가 팔로우하는 유저들 검색
    if ('following' in req.query) {
      const user = await User.findOne({ username: req.query.following });
      const follows = await Follow.find({ follower: user._id});

      // 조건 추가
      where._id = follows.map(follow => follow.following);
    }

    // 유저의 팔로워 검색
    if ('followers' in req.query) {
      const user = await User.findOne({ username: req.query.followers });
      const follows = await Follow
        .find({ following: user._id })

      where._id = follows.map(follow => follow.follower);
    }

    // 특정 게시물을 좋아하는 유저 검색
    if ('favorite' in req.query) {
      const favorites = await Favorite.find({ article: req.query.favorite })

      where._id = favorites.map(favorite => favorite.user);
    }

    // 유저이름으로 유저 검색 //users?username=cat
    if('username' in req.query) {
      where.username = new RegExp(req.query.username, 'i'); //RegExp c만 검색해도 c포함한 모든 유저 검색
    }

    // 이메일로 유저 검색
    if ('email' in req.query) {
      where.email = req.query.email;
    }

    // 결과 개수
    const userCount = await User.count(where);
    const _users = await User.find(where).limit(limit).skip(skip); // find 메서드 여러개를 array로

    const users = [];

    for (let _user of _users) {
      const user = {}
      user.username = _user.username;
      user.fullName = _user.fullName;
      user.image = _user.image;

      users.push(user);
    }

    res.json({ users, userCount });

  } catch (error) {
    next(error);
  }
}


// 정보 수정
exports.edit = [
  fileHandler('profiles').single('image'), // single 파일을 한개만 처리할때, 없으면 지나감
  async (req, res, next) => {
    try {

      // req.user: 로그인한 유저
      const _user = await User.findById(req.user._id);

      if (req.file) {
        _user.image = req.file.filename;
      }

      // 계정 업데이트
      Object.assign(_user, req.body); // req.body 유저가 업데이트한 정보들
      // _user 객체에서 req.body에 담긴 정보(속성)만 업데이트
      await _user.save();

      const token = _user.generateJWT();

      const user = {
        email: _user.email,
        username: _user.username,
        fullName: _user.fullName,
        image: _user.image,
        bio: _user.bio,
        token
      }

      res.json({ user });

    } catch (error) {
      next(error);
    }
  }
]