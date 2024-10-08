import React, { useEffect, useRef } from "react";

const FallingSymbols = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 사용할 기호들
    const symbols = "0123456789+-*/=";
    const fontSize = 60; // 글자 크기 증가
    const columns = canvas.width / fontSize;

    // 각 열에 대해 떨어지는 위치를 랜덤하게 설정
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.floor((Math.random() * canvas.height) / fontSize); // 랜덤한 위치에서 시작
    }

    function draw() {
      // 배경색을 더 연하게 처리
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 글자 색을 더 연한 초록색으로 설정
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // 투명도 0.5로 설정
      ctx.font = fontSize + "px Arial";

      for (let i = 0; i < drops.length; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        // 글자 간 간격 추가
        ctx.fillText(symbol, i * fontSize, drops[i] * fontSize);

        // 화면 하단을 넘어가면 다시 위에서 시작하도록
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 80);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default FallingSymbols;
