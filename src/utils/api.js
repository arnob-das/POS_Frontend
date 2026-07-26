import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
rawBaseUrl = rawBaseUrl.replace(/\/+$/, "");
if (!rawBaseUrl.endsWith("/api")) {
  rawBaseUrl += "/api";
}

const API = axios.create({
  baseURL: rawBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token from localStorage if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
