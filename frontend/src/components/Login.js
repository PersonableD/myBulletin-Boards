import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import api from "../api";

//로그인 성공 시 jwt 토큰을 로컬 스토리지에 저장

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //로그인 API 호출
      const response = await api.post("/auth/login", { email, password });
      //응답으로 받은 JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem("token", response.data.token);
      //로그인 성공 후 다른작업 수행(다른페이지로 넘어감)
      alert("로그인 성공!");
      navigate("/capture");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>로그인</h2>
      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  );
};

export default Login;
