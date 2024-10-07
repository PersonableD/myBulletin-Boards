import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import s3 from "../config/s3.js";
import { Buffer } from "buffer"; //Node.js 내장 객체
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    //최신순 정렬으로 게시물 불러오기
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

//인증된 사용자만 게시물 작성 가능
router.post("/create", auth, async (req, res) => {
  const { title, content, image } = req.body;

  if (!image) {
    return res.status(400).send("이미지가 제공되지 않았습니다.");
  }

  const buffer = Buffer.from(image, "base64"); // Base64 데이터를 버퍼로 변환

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `images/${Date.now()}.jpg`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  try {
    //s3에 이미지 업로드
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location; // S3에 저장된 이미지의 URL

    //게시물 모델에 요청받은 post 내용을 담아서 저장함
    const newPost = new Post({
      title,
      content,
      author: req.user.id, // req.user는 auth에서 가져옴
      imageUrl,
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("게시물 작성 오류:", error);
    res.status(500).send("게시물 작성 중 오류가 발생했습니다.");
  }
});
router.put("/edit/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    //라우터에 :id 이부분을 가지고 게시물을 찾음/수정하면 이미 있는 게시물이여야 함
    let post = await Post.findById(req.params.id);
    //게시물이 없다면 게시물을 찾을 수 없다는 메세지 띄움
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //게시물 작성자 == 수정하려는 작성자인지?
    if (post.author.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User not authorized" });
    }
    //게시물 업데이트
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
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
