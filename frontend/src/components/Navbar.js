import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 추가
function Navbar() {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  //로그아웃 함수
  const handleLogout = () => {
    const isConfirmed = window.confirm("정말 로그아웃 하시겠습니까?"); // 로그아웃 확인 팝업
    if (isConfirmed) {
      localStorage.removeItem("token"); //토큰 삭제
      navigate("/login"); //로그인 페이지로 이동
      window.location.reload(); // 페이지 리로드를 통해 상태 초기화
    }
  };

  const handleRetake = () => {
    navigate("/capture");
  };
  // 정글네컷 버튼 클릭 시 페이지 리로드
  const handleReload = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    window.location.reload(); // 현재 페이지 리로드
  };
  return (
    <div class="space-y-4">
      <header class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-800 text-sm py-3">
        <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div class="flex items-center justify-between  w-full">
            <a
              class="flex-none text-3xl font-semibold text-green-400 focus:outline-none focus:opacity-80 cursor-pointer"
              onClick={handleReload}
            >
              정글네컷
            </a>
            <div class="flex flex-1 justify-center">
              <button
                class="text-xl font-semibold text-white focus:outline-none focus:opacity-80 cursor-pointer bg-green-400 rounded-lg px-3 py-3"
                onClick={handleRetake}
              >
                다시 찍기
              </button>
            </div>
            <a
              className="flex-none text-xl font-semibold text-white focus:outline-none focus:opacity-80 ml-auto cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
