import React, { useState } from "react";
import api from "../api";
//useState: 사용자가 입력한 제목과 내용을 상태로 관리하고, 제출 버튼을 클릭할 때 상태값을 서버에 보냄
const CreatePost = () => {
  const [title, setTitle] = useState(""); //제목 상태
  const [content, setContent] = useState(""); //내용 상태
  //handleSubmit: 폼 제출 시 호출되는 함수로, API 요청을 보내서 게시물을 생성.
  const handleSubmit = async (e) => {
    // 기본 폼 제출 동작 방지
    // 폼 제출 시 페이지가 새로고침되는 것을 막음
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT 토큰을 로컬스토리지에서 가져옴
      console.log("Token:", token);
      await api.post(
        "/posts/create",
        { title, content },
        { headers: { "x-auth-token": token } } //인증 토큰을 헤더에 포함
      );
      alert("게시물이 성공적으로 작성되었습니다.");
      setTitle(""); //폼 초기화
      setContent(""); //폼 초기화
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>게시물 작성</h2>
      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 입력값을 상태로 저장
          required
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)} // 입력값을 상태로 저장
          required
        />
      </div>
      <button type="submit">작성</button>
    </form>
  );
};

export default CreatePost;
