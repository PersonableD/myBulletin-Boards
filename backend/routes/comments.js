import express from "express";
import auth from "../middleware/auth.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const router = express.Router();
//댓글 불러오기 라우터
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.status(200).json(comments); // 댓글 목록 배열 반환
  } catch (error) {
    res.status(500).json({ msg: "댓글 불러오기 오류" });
  }
});
//댓글 작성 라우터
router.post("/:postId", auth, async (req, res) => {
  const { text } = req.body;
  try {
    //댓글 달 게시물 찾기
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //새로운 댓글 달기
    const newComment = new Comment({
      post: req.params.postId, //댓글이 달릴 게시물 id
      text,
      user: req.user.id, //현재 로그인한 사용자 id
    });
    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
//댓글 삭제 라우터
router.delete("/:commentId", auth, async (req, res) => {
  try {
    let post = await Comment.findById(req.params.commentId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //게시물 작성자 == 삭제하려는 작성자인지?
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    //여기 remove()로 했다가 안되서 deleteOne()으로 바꾸니까 됨
    await post.deleteOne();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "delete error" });
  }
});

export default router;
