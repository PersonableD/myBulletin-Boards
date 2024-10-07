import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // 백엔드 URL
});

export default api;
