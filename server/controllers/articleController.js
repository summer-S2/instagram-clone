const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const fileHandler = require('../utils/fileHandler');


// 게시물 가져오기
exports.articles = async (req, res, naxt) => {
  try {

    const where = {}; // 검색 조건
    const limit = req.query.limit || 9; // 한페이지에 몇개 가져올건지
    const skip = req.query.skip || 0; // 다음페이지에서 몇개 스킵할건지

    // 특정 유저의 게시물만 가져오는 조건
    if ('username' in req.query) { // 타임라인
      const user = await User
        .findOne({ username: req.query.username });
      where.author = user._id;
    }

    // 게시물 개수 구하기
    const articleCount = await Article.count(where);
    // 게시물 가져오기
    const _articles = await Article
      .find(where) // 여러개 찾기
      .sort({ created: 'desc'}) // 정렬: 생성일기준 내림차순
      .limit(limit)
      .skip(skip)

    const articles = [];
    // 데이터 가공

    for (let _article of _articles) {
      
      // 좋아요 갯수
      const favoriteCount = await Favorite.count({ article: _article._id });
      // 댓글 갯수
      const commentCount = await Comment.count({ article: _article._id });

      const article = {
        images: _article.images,
        favoriteCount,
        commentCount,
        id: _article._id,
      }

      articles.push(article);
    }

    res.json({ articles, articleCount });


  } catch (error) {
    next(error)
  }
}


// 게시물 한개 가져오기 ( 게시물 상세보기 )
exports.article = async (req, res, next) => {
  try {

    const _article = await Article.findById(req.params.id); // 파라미터로 전달된 id를 가지고 게시물을 찾음

    // 게시물이 존재하지 않을 경우
    if (!_article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    // 게시물 가공
    const favorite = await Favorite
      .findOne({ user: req.user._id, article: _article._id });
    const commentCount = await Comment
      .count({ article: _article._id});
    const user = await User
      .findById(_article.author);

    const article = {
      images: _article.images,
      description: _article.description, // 사진 설명
      displayDate: _article.displayDate, // 보여주기용 날짜
      author: { // 게시물 작성자
        username: user.username,
        image: user.image,
      },
      favoriteCount: _article.favoriteCount,
      isFavorite: !!favorite, // 로그인한 유저가 좋아하는 게시물인지? (true/false)
      commentCount, // 댓글 갯수
      id: _article._id
    }

    res.json({ article });

  } catch (error) {
    next(error)
  }
}


// 게시물 작성 : 사진최소 1개 이상
exports.create = [
  fileHandler('articles').array('images'), // images : form의 input
  async (req, res, next) => {
    try {
      
      const files = req.files; // 클라이언트가 업로드한 파일들은 req.files에 담김

      // 파일이 업로드 되지 않은 경우 (1개 미만)
      if (files.length < 1) {
        const err = new Error('File is required');
        err.status = 400;
        throw err;
      }

      // 생성된 파일 이름 배열
      const images = files.map(file => file.filename); // multer가 저장한 파일들을 담는 array

      // article 생성
      const article = new Article({
        images, // key와 일치
        description: req.body.description,
        author: req.user._id, 
      });

      await article.save();

      res.json({ article });

    } catch (error) {
      next(error);
    }
  }
]


// 게시물 삭제
exports.delete = async (req, res, next) => {
  try {

    // 파라미터로 게시물 검색
    const article = await Article
      .findById(req.params.id); // 식별할 id를 파라미터(주소창)에 보냄

    // 게시물을 찾을 수 없는 경우
    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    // 삭제를 요청한 유저와 게시물 작성자가 다를 경우
    if (req.user._id.toString() !== article.author.toString()) { // 로그인유저아이디 !== 작성자아이디
      const err = new Error("Author is not correct");
      err.status = 400;
      throw err;
    }

    await article.delete(); // 삭제메서드

    res.json({ article }); // 클라이언트에게 전달



  } catch (error) {
    next (error);
  }
}


// 피드
exports.feed = async (req, res, next) => {
  try {

    // 로그인 유저가 팔로우하는 유저들 검색
    const follows = await Follow.find({ follower: req.user._id });
    const followings = follows.map(follow => follow.following);

    // 게시물 검색조건
    const where = { author: [...followings, req.user._id] } // user가 follow하는 사람들이 작성자인 게시물과 user의 게시물
    const limit = req.query.limit || 5;
    const skip = req.query.skip || 0;

    // 게시물 검색 (쿼리)
    const articleCount = await Article.count(where);
    const _articles = await Article // 쿼리 결과
      .find(where)
      .sort({ created: 'desc' }) // 생성일기준 내림차순 정렬
      .skip(skip)
      .limit(limit)

    // 데이터 가공
    const articles = []; // 가공된 데이터를 여기에 넣음
    
    for (let _article of _articles) {
      const favorite = await Favorite
        .findOne({ user: req.user._id, article: _article._id }); // 현재유저, 현재검색된 게시물
      const commentCount = await Comment
        .count({ article: _article._id });
      const user = await User.findById(_article.author);

      const article = {
        images: _article.images,
        description: _article.description,
        displayDate: _article.displayDate, // virtual
        author: {
          username: user.username,
          image: user.image,
        },
        favoriteCount: _article.favoriteCount,
        isFavorite: !!favorite,
        id: _article._id,
      }

      articles.push(article);
    }

    res.json({ articles, articleCount }); // articleCount -> 게시물유무, 더보기버튼 구현시 필요

  } catch(error) {
    next(error)
  }
}


// 좋아요
exports.favorite = async (req, res, next) => {
  try {

    // 파라미터를 id로 게시물 검색
    const article = await Article.findById(req.params.id);

    // 이미 좋아요한 게시물일 경우
    const favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id }) // 현재 로그인유저, 현재 파라미터로 전달된 게시물

    if (favorite) {
      const err = new Error("Already favorite article");
      err.status = 400;
      throw err;
    }

    // 좋아요 게시물에 추가
    const newFavorite = new Favorite({
      user: req.user._id,
      article: article._id,
    })

    await newFavorite.save();

    // 게시물의 좋아요 1증가
    article.favoriteCount++;
    await article.save();

    res.json({ article });

  } catch (error) {
    next(error)
  }
}


// 좋아요 취소
exports.unfavorite = async (req, res, next) => {
  try {

    // 게시물 검색
    const article = await Article.findById(req.params.id);

    // 좋아요한 게시물이 아닌 게시물의 좋아요 취소를 요청한 경우
    const favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id });

    if (!favorite) {
      const err = new Error("Not favorite article");
      err.status = 400;
      throw err;
    }

    await favorite.delete();

    article.favoriteCount--;
    await article.save();

    res.json({ article });

  } catch (error) {
    next(error)
  }
}