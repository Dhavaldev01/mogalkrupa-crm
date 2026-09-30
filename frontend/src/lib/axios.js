import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api/v1",

  timeout: 10000,

  // IMPORTANT:
  // Backend JWT HTTP-only cookie મોકલશે/વાંચશે
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;