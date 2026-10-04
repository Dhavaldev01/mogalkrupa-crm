import api from "./api";

const invoiceService = {
  getInvoices: (params) => api.get("/invoices", { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  createInvoice: (data) => api.post("/invoices", data),
  updateInvoiceStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),
  exportCustomerInvoices: (id, params) => api.get(`/invoices/customer/${id}/export`, { params, responseType: 'blob' }),
  getEarliestInvoiceYear: () => api.get("/invoices/earliest-year"),
};

export default invoiceService;
