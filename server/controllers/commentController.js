const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { findById } = require('../models/User');

// 댓글 생성
exports.create = async (req, res, next) => {
  try {

    // 댓글이 달릴 게시물 검색
    const article = await Article.findById(req.params.id); // 파라미터아이디로 게시물 검색

    const _comment = new Comment({
      article: article._id, // id는 ObjectId로 저장되기때문에 파라미터로 저장할 수 없음. 파라미터는 문자열
      content: req.body.content,
      author: req.user._id,
    })

    await _comment.save();

    // 데이터 가공
    const user = await User.findById(_comment.author);

    const comment = {
      id: _comment._id,
      content: _comment.content,
      article: article._id,
      author: {
        username: user.username,
        image: user.image,
      },
      created: _comment.created,
    }

    res.json({ comment });
    
  }catch (error) {
    next(error)
  }
}


// 댓글 삭제
exports.delete = async (req, res, next) => {
  try {

    // 삭제할 댓글 검색
    const comment = await Comment
      .findById(req.params.id);

    // 댓글 작성자가 아닌 경우 삭제 불가능
    if (req.user._id.toString() !== comment.author.toString()) {
      const err = new Error("User is not correct");
      err.status = 400;
      throw err;
    }

    // 댓글 삭제
    await comment.delete();

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}


// 댓글 가져오기 - 항상 전체를 가져옴
exports.comments = async (req, res, next) => {
  try {

    // 게시물 검색
    const article = await Article.findById(req.params.id);

    const where = { article: article._id }; // 조건 검색
    const limit = req.query.limit || 10; // 여러개를 검색할때 가져오는 조건
    const skip = req.query.skip || 0; // 여러개를 검색할때 가져오는 조건

    // 댓글 갯수와 댓글 검색
    const commentCount = await Comment.count(where);
    const _comments = await Comment
      .find(where)
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

      // 댓글 가공

    const comments = [];

    for (let _comment of _comments) {
      const user = await User.findById(_comment.author);

      const comment = {
        id: _comment._id,
        content: _comment.content,
        author: {
          username: user.username,
          image: user.image,
        },
        created: _comment.created,
        displayDate: _comment.displayDate, // 보여주기용 날짜
      }

      comments.push(comment);
    }

    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
}