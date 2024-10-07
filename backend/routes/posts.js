import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

//인증된 사용자만 게시물 작성 가능
router.post("/create", auth, (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    title,
    content,
    author: req.user.id,
  };
  res.json(newPost);
});
router.put("/edit/:id", auth, (req, res) => {});
router.delete("/delete", auth, (req, res) => {});

export default router;
