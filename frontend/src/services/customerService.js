import api from "./api";

const customerService = {
  getCustomers: (params) => api.get("/customers", { params }),
  getCustomerSummary: (params) => api.get("/customers/summary", { params }),
  getCustomerSummaryById: (id) => api.get(`/customers/${id}/summary`),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post("/customers", data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  exportCustomerBillingSummary: (params) => api.get("/customers/billing-summary/export", { params, responseType: 'blob' }),
};

export default customerService;
