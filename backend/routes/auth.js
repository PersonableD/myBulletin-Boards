import express from "express";
import bcrypt from "bcryptjs"; //해싱작업을 위함
import User from "../models/User.js";
import jwt from "jsonwebtoken"; //JWT는 사용자 인증을 위해 토큰을 발급
const router = express.Router();

//login 라우트
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" }); //유효하지않은 자격
    }
    //로그인창에 입력한 패스워드와 email 정보로 DB안에서 찾은 패스워드가 일치하는 지 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //JWT 생성 sign(페이로드,서명비밀키,유효기간)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

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
