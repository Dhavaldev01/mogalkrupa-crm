import axios from "axios";

const axiosInstance = axios.create({
  // In production, use Vercel as a same-origin proxy. This avoids
  // iPhone/Safari third-party cookie blocking between vercel.app and onrender.com.
  baseURL: import.meta.env.PROD
    ? "/api/v1"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",

  timeout: 10000,

  // IMPORTANT:
  // Backend JWT HTTP-only cookie મોકલશે/વાંચશે
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;