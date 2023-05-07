const express = require('express');
const router = express.Router();
const passport = require('passport'); // 인증처리 패키지
const auth = passport.authenticate("jwt", { session: false });
const jwtStrategy = require("../auth/jwtStrategy");
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const commentController = require('../controllers/commentController');
const profileController = require('../controllers/profileController');

passport.use(jwtStrategy); // strategy는 여러개있음.. 


// INDEX 
router.get('/', (req, res, next) => { // 라우터: 요청인덱스와 컨트롤러를 연결시키는 역할
  res.json({ message: 'API Server - INDEX PAGE' })
});

/* 

  * HTTP Request Method * 데이터를 제어하는 4가지 메서드 CRUD
  
  1 GET - Read data : 데이터를 읽을때 사용
  2 POST - Create data : 데이터를 생성할때 요청
  3 PUT - Update data : 게시물을 업데이트할때 사용
  4 DELETE - Delete data : 데이터를 삭제할때 사용

*/

/* USERS */
router.post('/users', userController.register);
router.post('/user/login', userController.login);
router.get('/users', userController.users);
router.put('/user', auth, userController.edit);

/* ARTICLES */
router.get('/articles', auth, articleController.articles); // 게시물 여러개
router.get('/articles/:id', auth,  articleController.article); // 게시물 한개
router.post('/articles',auth, articleController.create); // 게시물 생성
router.delete('/articles/:id', auth, articleController.delete); // 게시물 삭제
router.get('/feed', auth, articleController.feed); // 피드의 게시물
router.post('/articles/:id/favorite', auth, articleController.favorite);// 좋아요 누름
router.delete('/articles/:id/favorite', auth, articleController.unfavorite);// 좋아요 취소

/* CONTENTS */
router.get('/articles/:id/comments', auth, commentController.comments); // 댓글 검색
router.post('/articles/:id/comments', auth, commentController.create); // 댓글 생성
router.delete('/comments/:id', auth, commentController.delete); // 댓글 삭제

/* PROFILES*/
router.get('/profiles/:username', auth, profileController.details); // 프로필 디테일 가져오기
router.post('/profiles/:username/follow', auth, profileController.follow); // 팔로우하기
router.delete('/profiles/:username/follow', auth, profileController.unfollow); // 언팔로우하기

module.exports = router;
