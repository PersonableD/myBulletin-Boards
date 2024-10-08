import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 회원가입 처리 함수
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      //회원가입 API호출
      await api.post("/auth/register", { username, email, password });
      alert("회원가입이 완료되었습니다. 로그인 해 주세요.");
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>회원가입</h2>
      <div>
        <label>사용자 이름</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
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
      <button type="submit">회원가입</button>
    </form>
  );
};

export default Register;
