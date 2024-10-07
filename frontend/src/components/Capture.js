import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import api from "../api";

function Capture() {
  const webcamRef = useRef(null);
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 내용 상태
  const [images, setImages] = useState([]); // 4장의 사진 상태
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isCapturing && images.length < 4) {
      const timer = setTimeout(() => {
        captureImage();
      }, 5000); // 10초 간격으로 사진 촬영
      return () => clearTimeout(timer);
    }
  }, [isCapturing, images]);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImages((prevImages) => [...prevImages, imageSrc]);
    }
  };

  const startCapture = () => {
    setImages([]); //기존 이미지 초기화
    setIsCapturing(true);
  };

  // 설정: 2x2 프레임, 총 4개의 사진
  const createCollage = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frameWidth = 640;
      const frameHeight = 480;

      // 설정: 2x2 프레임, 총 4개의 사진
      canvas.width = frameWidth * 2;
      canvas.height = frameHeight * 2;

      let loadedImages = 0;
      images.forEach((image, index) => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          const x = (index % 2) * frameWidth;
          const y = Math.floor(index / 2) * frameHeight;
          ctx.drawImage(img, x, y, frameWidth, frameHeight);
          loadedImages++;
          if (loadedImages === images.length) {
            canvas.toBlob(async (blob) => {
              try {
                const imageUrl = await uploadImage(blob);
                resolve(imageUrl);
              } catch (error) {
                reject(error);
              }
            }, "image/jpeg");
          }
        };
      });
    });
  };

  const uploadImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "collage.jpg");
    try {
      const response = await api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const createPost = async () => {
    //handleSubmit: 폼 제출 시 호출되는 함수로, API 요청을 보내서 게시물을 생성.
    // const handleSubmit = async (e) => {
    //   // 기본 폼 제출 동작 방지
    //   // 폼 제출 시 페이지가 새로고침되는 것을 막음
    //   e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT 토큰을 로컬스토리지에서 가져옴
      console.log("Token:", token);

      // 인생네컷 콜라주 생성 후 S3에 업로드
      const collageUrl = await createCollage();

      await api.post(
        "/posts/create",
        { title, content, imageUrl: collageUrl },
        { headers: { "x-auth-token": token } } //인증 토큰을 헤더에 포함
      );
      alert("게시물이 성공적으로 작성되었습니다.");
      setTitle(""); //폼 초기화
      setContent(""); //폼 초기화
      setImages([]); // 이미지 초기화
      setIsCapturing(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
        />
        <button
          onClick={startCapture}
          disabled={isCapturing}
          style={{ margin: "10px" }}
        >
          인생네컷 촬영 시작
        </button>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "640px",
            marginTop: "20px",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`인생네컷 ${index + 1}`}
              style={{ width: "50%", height: "240px", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost();
        }}
      >
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
        <button type="submit" disabled={images.length < 4}>
          작성
        </button>
      </form>
    </div>
  );
}

export default Capture;
