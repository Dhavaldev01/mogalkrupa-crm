import api from "./api";

const settingsService = {
  getSettings: () => api.get("/settings"),
  updateSettings: (data) => api.put("/settings", data),
  uploadImage: (formData) => api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};

export default settingsService;
