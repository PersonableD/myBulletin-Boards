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
      window.location.reload(); // 페이지 리로드를 통해 상태 초기화
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };
  const handleNavigateToRegister = () => {
    navigate("/register"); // 회원가입 페이지로 이동
  };

  return (
    <div class="flex justify-center items-center h-screen">
      <div
        style={{ width: "500px", height: "550px" }}
        className="relative bg-gray-900 rounded-lg shadow-md p-8"
      >
        <h1 className="absolute bottom-0 right-0 p-4 text-gray-700 text-4xl text-green-400">
          정글네컷
        </h1>
        <div className="w-100 mx-auto bg-gray-300 p-4 px-8 inner-shadow">
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
            <div>
              <label>이메일</label>
              <input
                className="block w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>비밀번호</label>
              <input
                className="block w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="flex w-full justify-center mb-4 rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              type="submit"
            >
              로그인
            </button>
          </form>
          <div className="flex items-center justify-between mb-6">
            <p>계정이 없으신가요?</p>
            <button onClick={handleNavigateToRegister}>회원가입 하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
