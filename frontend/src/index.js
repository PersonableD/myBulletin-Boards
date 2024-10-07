import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // App 컴포넌트 불러오기

// ReactDOM.render()를 사용하여 App 컴포넌트를 HTML의 root에 렌더링
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
