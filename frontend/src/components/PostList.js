import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 추가
import api from "../api";

const PostList = () => {
  const [posts, setPosts] = useState([]); // 게시물 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 URL
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 게시물 ID
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const userId = localStorage.getItem("userId"); // 로그인한 사용자 ID를 로컬스토리지에서 가져오기
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

  //좋아요 함수
  const handleLike = async (postId) => {
    try {
      const response = await api.put(
        `/posts/like/${postId}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"), // 인증 토큰 추가
          },
        }
      );

      //좋아요 수 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Failed to update likes:", error);
      alert("좋아요를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  // 모달 열기
  const openModal = (post) => {
    setSelectedPostId(post._id);
    setSelectedImage(post.imageUrl);
    fetchComments(post._id); // 댓글 불러오기
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setComments([]);
  };

  //게시물 삭제
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/delete/${postId}`, {
        headers: { "x-auth-token": token },
      });

      setPosts(posts.filter((post) => post._id !== postId));
      alert("게시물이 삭제되었습니다.");
    } catch (error) {
      console.error("Failed to delete post:", error);
      if (userId !== postId) {
        alert("게시물 작성자만 삭제 가능합니다.");
      } else {
        alert("게시물 삭제 실패.");
      }
    }
  };
  // 댓글 가져오기
  const fetchComments = async (postId) => {
    try {
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data); // 댓글 상태 설정
    } catch (error) {
      console.error("댓글을 불러오는 중 오류가 발생했습니다:", error);
    }
  };
  // 댓글 추가 처리
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem("token"); // 로그인한 사용자 인증을 위한 토큰
        const response = await api.post(
          `/comments/${selectedPostId}`,
          {
            text: newComment, // 댓글 내용
            post: selectedPostId, // 댓글이 달린 게시물 ID
          },
          {
            headers: {
              "x-auth-token": token, // 인증 헤더에 JWT 토큰 추가
            },
          }
        );
        // 서버로부터 응답을 받은 댓글을 추가함
        setComments([...comments, response.data]);
        setNewComment(""); // 입력 필드 초기화
      } catch (error) {
        console.error("댓글을 추가하는 중 오류가 발생했습니다:", error);
        alert("댓글 작성 중 오류가 발생했습니다.");
      }
    }
  };
  const handleDownload = () => {
    // 이미지가 S3에 있으며 Blob을 사용해 다운로드 링크를 생성
    fetch(selectedImage, {
      method: "GET",
      headers: {
        "Content-Type": "image/jpeg", // S3에서 이미지로 가져오기 위한 Content-Type 설정
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "downloaded-image.jpg"; // 파일 이름 지정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // URL 객체 해제
      })
      .catch((error) => {
        console.error("이미지 다운로드 실패:", error);
        alert("이미지 다운로드에 실패했습니다. 권한 설정을 확인해주세요.");
      });
  };
  return (
    <div className="w-full">
      <div className="relative right-0">
        <div data-tab-content="" className="p-5">
          <div className="block opacity-100" id="app" role="tabpanel">
            <ul
              role="tabpanel"
              className="grid w-full grid-cols-4 gap-6 p-4 font-sans text-base antialiased font-light leading-relaxed text-gray-700 h-max"
              data-value="html"
            >
              {posts.map((post) => (
                <li key={post._id} className="flip-card">
                  <div className="flip-card-inner">
                    {/* 앞면 */}
                    <div className="flip-card-front relative">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full max-w-full rounded-lg"
                        />
                      )}
                      <p className="flip-card-front-inner absolute text-xl  bottom-11  right-4 text-white">
                        {" "}
                        &lt;/💚 {post.likes}&gt;
                      </p>
                    </div>
                    {/* 뒷면 */}
                    <div className="flip-card-back">
                      {/* 본인이 작성한 게시물에만 삭제 버튼 보이도록 설정 */}

                      <button
                        onClick={() => handleDelete(post._id)}
                        className="absolute top-2 right-2 text-black px-2 py-1 rounded-full"
                      >
                        X
                      </button>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700">{post.content}</p>
                      <button
                        onClick={() => handleLike(post._id)}
                        class="text-2xl hover:scale-110 active:scale-90 transform transition-all duration-200 ease-in-out"
                      >
                        💚
                      </button>
                      <button
                        onClick={() => openModal(post)}
                        className="bg-white border-2 border-black text-black py-2 px-4 rounded transition duration-300 hover:bg-green-500 hover:text-white"
                      >
                        크게 보기
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* 모달 */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
                <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-full relative overflow-hidden flex">
                  {/* 이미지 섹션 */}
                  <div className="w-2/3 pr-4">
                    <button
                      onClick={closeModal}
                      className="absolute top-2 right-2 text-gray-800 hover:text-gray-600"
                    >
                      ✖
                    </button>
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="크게 보기 이미지"
                        className="w-full h-auto max-h-[80vh] rounded-lg mb-4 object-contain"
                      />
                    )}
                    <button
                      onClick={handleDownload}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-green-600"
                    >
                      이미지 다운로드
                    </button>
                  </div>

                  {/* 댓글 섹션 */}
                  <div className="w-1/3 border-l-2 pl-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold mb-4">댓글</h2>
                    <div className="flex-grow overflow-y-auto mb-4">
                      {comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <div
                            key={index}
                            className="mb-2 p-2 border-b border-gray-300"
                          >
                            {comment.text}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">아직 댓글이 없습니다.</p>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-1 flex items-center bg-white p-2 rounded-md">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex border p-2 rounded-md"
                        placeholder="댓글을 입력하세요..."
                      />
                      <button
                        onClick={handleAddComment}
                        className="bg-white border-2 border-black text-black py-2 px-4 rounded transition duration-300 hover:bg-green-500 hover:text-white"
                      >
                        댓글 추가
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
