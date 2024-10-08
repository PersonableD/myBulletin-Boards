import express from "express"; //Node.js에서 웹 서버를 만들 수 있도록 도와주는 프레임워크
import connectDB from "./config/db.js"; // 다른 파일에서 connectDB 함수를 가져오는 것
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import uploadRoutes from "./routes/upload.js";
import cors from "cors";

const app = express();
//DB연결
connectDB();

// CORS 설정 추가
app.use(cors()); // 모든 도메인에서의 요청을 허용

//들어오는 요청의 데이터를 json 형식으로 파싱하는 미들웨어
app.use(express.json());
//라우트 연결
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
