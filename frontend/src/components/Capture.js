import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import api from "../api";

function Capture() {
  const webcamRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCapturing && images.length < 4) {
      startCountdown();
    }
  }, [isCapturing, images]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const countdownInterval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        triggerFlash();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => {
      captureImage();
      setFlash(false);
    }, 100);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImages((prevImages) => [...prevImages, imageSrc]);
    }
  };

  const startCapture = () => {
    setImages([]);
    setIsCapturing(true);
  };

  const createCollage = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frameWidth = 600;
      const frameHeight = 730;

      canvas.width = 1200;
      canvas.height = 1800;

      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.src =
        "https://seul-bucket.s3.ap-northeast-2.amazonaws.com/frames/jungle_frame_01.png.PNG";

      frameImg.onload = () => {
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
              ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

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
      };

      frameImg.onerror = (error) => {
        console.error(
          "프레임 이미지를 불러오는 중 오류가 발생했습니다.",
          error
        );
        reject(error);
      };
    });
  };

  const uploadImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "collage.jpg");
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error(
        "업로드 실패:",
        error.response ? error.response.data : error
      );
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const collageUrl = await createCollage();

      await api.post(
        "/posts/create",
        { title, content, imageUrl: collageUrl },
        { headers: { "x-auth-token": token } }
      );
      alert("게시물이 성공적으로 작성되었습니다.");
      setTitle("");
      setContent("");
      setImages([]);
      setIsCapturing(false);

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            width: "480px",
            height: "640px",
            objectFit: "cover",
          }}
        />

        {/* 촬영 버튼을 웹캠 아래에 배치 */}
        <button
          onClick={startCapture}
          disabled={isCapturing}
          style={{ marginTop: "10px" }}
        >
          인생네컷 촬영 시작
        </button>

        {/* 카운트다운 텍스트 */}
        {countdown && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "4rem",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {countdown}
          </div>
        )}

        {/* 플래시 효과 */}
        {flash && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              opacity: 0.8,
              zIndex: 1,
            }}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px", // 왼쪽과 오른쪽 열 사이의 간격
        }}
      >
        {/* 왼쪽 열 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px", // 이미지들 사이의 세로 간격 설정
          }}
        >
          {images
            .filter((_, index) => index % 2 === 0) // 인덱스가 짝수인 이미지를 필터링 (0, 2, 4...)
            .map((image, index) => (
              <img
                key={`left-${index}`}
                src={image}
                alt={`인생네컷 왼쪽 ${index + 1}`}
                style={{ width: "240px", height: "320px", objectFit: "cover" }}
              />
            ))}
        </div>

        {/* 오른쪽 열 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px", // 이미지들 사이의 세로 간격 설정
          }}
        >
          {images
            .filter((_, index) => index % 2 !== 0) // 인덱스가 홀수인 이미지를 필터링 (1, 3, 5...)
            .map((image, index) => (
              <img
                key={`right-${index}`}
                src={image}
                alt={`인생네컷 오른쪽 ${index + 1}`}
                style={{ width: "240px", height: "320px", objectFit: "cover" }}
              />
            ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost();
        }}
        style={{ marginLeft: "20px" }}
      >
        <h2>게시물 작성</h2>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
