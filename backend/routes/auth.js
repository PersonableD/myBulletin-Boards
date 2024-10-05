import express from "express";
import User from "../models/User.js";
//라우터 생성
const router = express.Router();
//post 요청을 처리하는 라우터
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //db에서 이미 사용자가 존재하는 지 확인함
    let user = await User.findOne({ email });
    //사용자가 존재하면 에러메세지 리턴
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    //클라이언트에서 받은 정보들을 새로운 User모델을 만들어 그안에 삽입
    user = new User({ username, email, password });

    //MongoDB에 사용자 저장
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    //유저가 없는데도 불구하고 에러가나는 경우이면
    //서버 에러일 것이니 서버 에러 메세지 리턴
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
