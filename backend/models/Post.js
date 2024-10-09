import mongoose from "mongoose";
//게시물 정보를 저장할 모델 정의
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
