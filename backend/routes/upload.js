import express from "express";
import multer from "multer";
import s3 from "../config/s3.js";
import auth from "../middleware/auth.js"; // 인증 미들웨어 가져오기

const router = express.Router();
//multer 설정(메모리 저장소 사용)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 이미지 업로드 라우트
router.post("/", auth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("이미지가 제공되지 않았습니다.");
  }

  const buffer = req.file.buffer;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `images/${Date.now()}.jpg`,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location; // S3에 저장된 이미지의 URL
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    res.status(500).send("이미지 업로드 중 오류가 발생했습니다.");
  }
});

export default router;
