import api from "./api";

export const customerService = {
  getAll: (params) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers", data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const rateService = {
  getAll: () => api.get("/rates"),
  getById: (id) => api.get(`/rates/${id}`),
  create: (data) => api.post("/rates", data),
  update: (id, data) => api.put(`/rates/${id}`, data),
  delete: (id) => api.delete(`/rates/${id}`),
};

export const invoiceService = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  updateStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export const paymentService = {
  getForInvoice: (invoiceId) => api.get(`/invoices/${invoiceId}/payments`),
  create: (invoiceId, data) => api.post(`/invoices/${invoiceId}/payments`, data),
  createBulk: (data) => api.post(`/invoices/bulk/payments`, data),
};

export const settingsService = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};

export const dashboardService = {
  getSummary: (params) => api.get("/dashboard/summary", { params }),
};
