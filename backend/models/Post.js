import mongoose from "mongoose";
//게시물 정보를 저장할 모델 정의
const postSchema = new mongoose.Schema({
  title: { type: String, reqired: true },
  content: { type: String, reqired: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", reqired: true },
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
