import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 추가
import api from "../api";

const PostList = () => {
  const [posts, setPosts] = useState([]); // 게시물 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  //fetch : 직접 가서 가져오다
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts"); //API로 게시물 목록 가져오기
        setPosts(response.data); //응답 데이터를 상태에 저장
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts(); //컴포넌트가 처음 렌더링될 때 게시물 목록을 가져옴
  }, []); //빈 배열을 넣으면 컴포넌트가 마운트 될때 한 번만 실행

  //로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token"); //토큰 삭제
    navigate("/login"); //로그인 페이지로 이동
    window.location.reload(); // 페이지 리로드를 통해 상태 초기화
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        로그아웃
      </button>
      <h1>게시물 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>작성자: {post.author}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{ width: "30%", height: "30%" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
