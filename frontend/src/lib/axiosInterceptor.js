import axiosInstance from "./axios";

// Note: No request interceptor is needed to add tokens because we use HTTP-only cookies

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 Unauthorized errors are handled locally by React Query / AuthContext
    // Global errors can be logged, but avoid redirecting here
    if (error.response?.status !== 401) {
      if (error.response) {
        console.error("API Error:", error.response.data.message || error.response.statusText);
      } else {
        console.error("Network Error");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;