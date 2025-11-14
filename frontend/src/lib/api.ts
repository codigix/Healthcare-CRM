import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  changePassword: (data: any) => apiClient.post('/auth/change-password', data),
};

export const doctorAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/doctors', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/doctors/${id}`),
  create: (data: any) => apiClient.post('/doctors', data),
  update: (id: string, data: any) => apiClient.put(`/doctors/${id}`, data),
  delete: (id: string) => apiClient.delete(`/doctors/${id}`),
};

export const patientAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/patients', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/patients/${id}`),
  create: (data: any) => apiClient.post('/patients', data),
  update: (id: string, data: any) => apiClient.put(`/patients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/patients/${id}`),
};

export const appointmentAPI = {
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/appointments', { params: { page, limit, ...filters } }),
  get: (id: string) => apiClient.get(`/appointments/${id}`),
  create: (data: any) => apiClient.post('/appointments', data),
  update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
};

export const invoiceAPI = {
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/invoices', { params: { page, limit, ...filters } }),
  get: (id: string) => apiClient.get(`/invoices/${id}`),
  create: (data: any) => apiClient.post('/invoices', data),
  update: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete(`/invoices/${id}`),
  downloadPdf: (id: string) => apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};

export const dashboardAPI = {
  stats: () => apiClient.get('/dashboard/stats'),
  recentAppointments: () => apiClient.get('/dashboard/recent-appointments'),
  revenueChart: () => apiClient.get('/dashboard/revenue-chart'),
  patientGrowth: () => apiClient.get('/dashboard/patient-growth'),
};

export const insuranceClaimsAPI = {
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/insurance-claims', { params: { page, limit, ...filters } }),
  get: (id: string) => apiClient.get(`/insurance-claims/${id}`),
  create: (data: any) => apiClient.post('/insurance-claims', data),
  update: (id: string, data: any) => apiClient.put(`/insurance-claims/${id}`, data),
  delete: (id: string) => apiClient.delete(`/insurance-claims/${id}`),
  getStatistics: () => apiClient.get('/insurance-claims/statistics/summary'),
};

export const specializationAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/specializations', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/specializations/${id}`),
  create: (data: any) => apiClient.post('/specializations', data),
  update: (id: string, data: any) => apiClient.put(`/specializations/${id}`, data),
  delete: (id: string) => apiClient.delete(`/specializations/${id}`),
};

export const prescriptionAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/prescriptions', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/prescriptions/${id}`),
  create: (data: any) => apiClient.post('/prescriptions', data),
  update: (id: string, data: any) => apiClient.put(`/prescriptions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/prescriptions/${id}`),
};

export const prescriptionTemplateAPI = {
  list: (page = 1, limit = 10, search = '', filter = 'all') => apiClient.get('/prescription-templates', { params: { page, limit, search, filter } }),
  get: (id: string) => apiClient.get(`/prescription-templates/${id}`),
  create: (data: any) => apiClient.post('/prescription-templates', data),
  update: (id: string, data: any) => apiClient.put(`/prescription-templates/${id}`, data),
  delete: (id: string) => apiClient.delete(`/prescription-templates/${id}`),
  use: (id: string) => apiClient.post(`/prescription-templates/${id}/use`, {}),
};

export const ambulanceAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/ambulances', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/ambulances/${id}`),
  create: (data: any) => apiClient.post('/ambulances', data),
  update: (id: string, data: any) => apiClient.put(`/ambulances/${id}`, data),
  delete: (id: string) => apiClient.delete(`/ambulances/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch(`/ambulances/${id}/status`, { status }),
};

export const emergencyCallsAPI = {
  list: (page = 1, limit = 10, search = '') => apiClient.get('/emergency-calls', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/emergency-calls/${id}`),
  create: (data: any) => apiClient.post('/emergency-calls', data),
  update: (id: string, data: any) => apiClient.put(`/emergency-calls/${id}`, data),
  delete: (id: string) => apiClient.delete(`/emergency-calls/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch(`/emergency-calls/${id}/status`, { status }),
};

export const departmentAPI = {
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/departments', { params: { page, limit, ...filters } }),
  get: (id: string) => apiClient.get(`/departments/${id}`),
  create: (data: any) => apiClient.post('/departments', data),
  update: (id: string, data: any) => apiClient.put(`/departments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/departments/${id}`),
  getStatistics: () => apiClient.get('/departments/statistics/summary'),
};
