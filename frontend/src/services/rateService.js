import api from "./api";

const rateService = {
  getRates: (params) => api.get("/rates", { params }),
  getRateById: (id) => api.get(`/rates/${id}`),
  createRate: (data) => api.post("/rates", data),
  updateRate: (id, data) => api.put(`/rates/${id}`, data),
  deleteRate: (id) => api.delete(`/rates/${id}`),
};

export default rateService;
