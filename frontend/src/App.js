import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Capture from "./components/Capture";
import Register from "./components/Register";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // JWT 토큰을 통해 인증 확인
  return (
    <Router>
      <div>
        <Routes>
          {/* 로그인 페이지 */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/capture" /> : <Login />}
          />
          {/* 회원가입 페이지 */}
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/capture" /> : <Register />
            }
          />
          {/* 인생네컷 촬영 페이지 (로그인 후 접근 가능) */}
          <Route
            path="/capture"
            element={isAuthenticated ? <Capture /> : <Navigate to="/login" />}
          />

          {/* 게시물 목록 페이지 (로그인 후 접근 가능) */}
          <Route
            path="/"
            element={isAuthenticated ? <PostList /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
