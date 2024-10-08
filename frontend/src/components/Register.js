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
    <div
      style={{ width: "500px", height: "550px" }}
      className="relative bg-gray-900 rounded-lg shadow-md p-8"
    >
      <h1 className="absolute bottom-0 right-0 p-4 text-gray-700 text-4xl text-green-400">
        정글네컷
      </h1>
      <div className="w-100 mx-auto bg-gray-300 p-4 px-8">
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
          <div>
            <label>사용자 이름</label>
            <input
              type="text"
              value={username}
              class="block w-full mb-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>이메일</label>
            <input
              type="email"
              value={email}
              class="block w-full mb-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              class="block w-full mb-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="flex mt-7 w-full justify-center mb-4 rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
