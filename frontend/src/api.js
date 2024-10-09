import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // 백엔드 URL
  // baseURL: "http://localhost:5000/api", // 백엔드 URL
});

export default api;
