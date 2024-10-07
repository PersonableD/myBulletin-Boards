import React, { useEffect, useState } from "react";
import api from "../api";

const PostList = () => {
  const [posts, setPosts] = useState([]); // 게시물 상태
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

  return (
    <div>
      <h1>게시물 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>작성자: {post.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
