import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

//인증된 사용자만 게시물 작성 가능
router.post("/create", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    //게시물 모델에 요청받은 post 내용을 담아서 저장함
    const newPost = new Post({
      title,
      content,
      author: req.user.id, // req.user는 auth에서 가져옴
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/edit/:id", auth, (req, res) => {});
router.delete("/delete", auth, (req, res) => {});

export default router;
