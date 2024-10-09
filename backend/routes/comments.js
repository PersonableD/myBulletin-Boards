import express from "express";
import auth from "../middleware/auth.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.status(200).json(comments); // 댓글 목록 배열 반환
  } catch (error) {
    res.status(500).json({ msg: "댓글 불러오기 오류" });
  }
});

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

export default router;
