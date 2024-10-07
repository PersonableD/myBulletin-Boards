import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, //댓글 달린 게시물
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //댓글을 작성한 사용자
  text: { type: String, required: true }, //댓글내용
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
