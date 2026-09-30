import api from "./api";

const customerService = {
  getCustomers: (params) => api.get("/customers", { params }),
  getCustomerSummary: () => api.get("/customers/summary"),
  getCustomerSummaryById: (id) => api.get(`/customers/${id}/summary`),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post("/customers", data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

export default customerService;
