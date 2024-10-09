import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // 백엔드 URL
});

export default api;
