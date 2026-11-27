import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getApiUrl = (): string => {
 if (typeof window !== 'undefined') {
 // If the API URL is pointing to the default placeholder domain, apply smart fallbacks
 if (BASE_API_URL.includes('api.medixpro.com')) {
 const hostname = window.location.hostname;
 // 1. Local Testing Fallback
 if (hostname === 'localhost' || hostname === '127.0.0.1') {
 return 'http://localhost:5000/api';
 }
 // 2. Relative Origin Fallback (same domain hosting/reverse proxy)
 return `${window.location.origin}/api`;
 }
 }
 return BASE_API_URL;
};

export const API_URL = getApiUrl();

const apiClient = axios.create({
 baseURL: API_URL,
 // Fail instead of waiting forever, so a page shows its error state rather than a never-ending loader.
 timeout: 60000,
 headers: {
 'Content-Type': 'application/json',
 },
});

// ---------------------------------------------------------------------------
// GET response cache: repeat visits / Back navigation show data instantly.
//  - Identical GETs inside CACHE_TTL_MS are served from memory.
//  - Identical GETs already in flight share one network request.
//  - Any write (POST/PUT/PATCH/DELETE) clears the cache, so saved changes
//    are never hidden behind stale data.
//  - Opt out per request with the header  'Cache-Control': 'no-cache'.
//  - Auth and notification endpoints and non-JSON responses are never cached.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 30_000;
const CACHE_MAX_ENTRIES = 200;
const NEVER_CACHE = /\/(auth|notifications?)(\/|\?|$)/;

const responseCache = new Map<string, { time: number; response: AxiosResponse }>();
const inflightRequests = new Map<string, Promise<AxiosResponse>>();
const networkAdapter = axios.getAdapter(axios.defaults.adapter);
let cacheVersion = 0;

export const clearApiCache = () => {
  cacheVersion++;
  responseCache.clear();
  inflightRequests.clear();
};

// Callers get their own copy so mutating response.data cannot corrupt the cache.
const copyResponse = (response: AxiosResponse, config: InternalAxiosRequestConfig): AxiosResponse => ({
  ...response,
  data: response.data === undefined ? response.data : structuredClone(response.data),
  config,
});

apiClient.defaults.adapter = async (config) => {
  const method = (config.method || 'get').toLowerCase();

  if (method !== 'get') {
    clearApiCache();
    return networkAdapter(config);
  }

  const url = config.url || '';
  const cacheable =
    (!config.responseType || config.responseType === 'json') &&
    !NEVER_CACHE.test(url) &&
    config.headers.get('Cache-Control') !== 'no-cache';
  if (!cacheable) return networkAdapter(config);

  const key = `${config.headers.get('Authorization') ?? ''}|${apiClient.getUri(config)}`;

  const hit = responseCache.get(key);
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) return copyResponse(hit.response, config);

  const pending = inflightRequests.get(key);
  if (pending) return copyResponse(await pending, config);

  const versionAtStart = cacheVersion;
  const request = networkAdapter(config)
    .then((response) => {
      // Skip caching if a write happened while this request was in flight.
      if (versionAtStart === cacheVersion) {
        responseCache.set(key, { time: Date.now(), response });
        if (responseCache.size > CACHE_MAX_ENTRIES) {
          const oldest = responseCache.keys().next().value;
          if (oldest !== undefined) responseCache.delete(oldest);
        }
      }
      return response;
    })
    .finally(() => {
      if (inflightRequests.get(key) === request) inflightRequests.delete(key);
    });
  inflightRequests.set(key, request);
  return copyResponse(await request, config);
};

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
 getDummyLogins: () => apiClient.get('/auth/dummy-logins'),
};

export const doctorAPI = {
 list: (page = 1, limit = 10, search = '') => apiClient.get('/doctors', { params: { page, limit, search } }),
 getAll: (page = 1, limit = 10, search = '') => apiClient.get('/doctors', { params: { page, limit, search } }),
 get: (id: string) => apiClient.get(`/doctors/${id}`),
 search: (name: string) => apiClient.get('/doctors/search', { params: { search: name, limit: 20 } }),
 available: (specialization?: string) => apiClient.get('/doctors/available', { params: { specialization } }),
 create: (data: any) => apiClient.post('/doctors', data),
 update: (id: string, data: any) => apiClient.put(`/doctors/${id}`, data),
 delete: (id: string) => apiClient.delete(`/doctors/${id}`),
};

export const patientAPI = {
  getAll: (page: number = 1, limit: number = 10) => apiClient.get(`/patients?page=${page}&limit=${limit}`),
  // Same naming as every other API client (list / get); `search` is supported by GET /patients.
  list: (page: number = 1, limit: number = 10, search: string = '') =>
    apiClient.get('/patients', { params: { page, limit, search } }),
  get: (id: string) => apiClient.get(`/patients/${id}`),
  search: (name: string) => apiClient.get(`/patients/search?name=${name}`),
  getById: (id: string) => apiClient.get(`/patients/${id}`),
  create: (data: any) => apiClient.post('/patients', data),
  update: (id: string, data: any) => apiClient.put(`/patients/${id}`, data),
  registrationMeta: () => apiClient.get('/patients/registration-meta'),
  searchMeta: () => apiClient.get('/patients/search-meta'),
  demographicsStats: () => apiClient.get('/patients/demographics-stats'),
  dashboard: (patientId?: string) => apiClient.get('/patients/dashboard', { params: { patientId } }),
  delete: (id: string) => apiClient.delete(`/patients/${id}`),
};

export const appointmentAPI = {
 list: (page = 1, limit = 10, filters = {}) => apiClient.get('/appointments', { params: { page, limit, ...filters } }),
 get: (id: string) => apiClient.get(`/appointments/${id}`),
 create: (data: any) => apiClient.post('/appointments', data),
 update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
 delete: (id: string) => apiClient.delete(`/appointments/${id}`),
 complete: (id: string, data: any) => apiClient.post(`/appointments/${id}/complete`, data),
 sendLabRequest: (id: string) => apiClient.post(`/appointments/${id}/send-lab-request`, {}),
 sendAdmissionRequest: (id: string) => apiClient.post(`/appointments/${id}/send-admission-request`, {}),
};

export const roomAllotmentAPI = {
  available: () => apiClient.get('/room-allotment/available'),
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/room-allotment/allotments', { params: { page, limit, ...filters } }),
  getById: (id: string) => apiClient.get(`/room-allotment/allotments/${id}`),
  create: (data: any) => apiClient.post('/room-allotment/allotments', data),
  update: (id: string, data: any) => apiClient.put(`/room-allotment/allotments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/room-allotment/allotments/${id}`),
  getDetails: (roomNumber?: string) => apiClient.get('/room-allotment/allotments', { params: { roomNumber, limit: 100 } }),
  getAllRooms: () => apiClient.get('/room-allotment/rooms'),
  byDepartment: (dept: string) => apiClient.get(`/room-allotment/by-department/${dept}`),
};

export const bedStatusAPI = {
  overview: () => apiClient.get('/bed-status'),
  byDepartment: (dept: string) => apiClient.get(`/bed-status/department/${dept}`),
};

export const transferAPI = {
  list: (page = 1, limit = 10, filters = {}) => apiClient.get('/transfers', { params: { page, limit, ...filters } }),
  get: (id: string) => apiClient.get(`/transfers/${id}`),
  create: (data: any) => apiClient.post('/transfers', data),
  update: (id: string, data: any) => apiClient.put(`/transfers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/transfers/${id}`),
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
 reception: () => apiClient.get('/dashboard/reception'),
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

export const medicineAPI = {
 list: (page = 1, limit = 10, filters = {}) => apiClient.get('/medicines', { params: { page, limit, ...filters } }),
 get: (id: string) => apiClient.get(`/medicines/${id}`),
 create: (data: any) => apiClient.post('/medicines', data),
 update: (id: string, data: any) => apiClient.put(`/medicines/${id}`, data),
 delete: (id: string) => apiClient.delete(`/medicines/${id}`),
 addStock: (id: string, data: any) => apiClient.post(`/medicines/${id}/add-stock`, data),
 getTransactions: (id: string) => apiClient.get(`/medicines/${id}/transactions`),
 getBatches: (id: string) => apiClient.get(`/medicines/${id}/batches`),
};

export const inventoryAPI = {
 list: (page = 1, limit = 10, filters = {}) => apiClient.get('/inventory', { params: { page, limit, ...filters } }),
 get: (id: string) => apiClient.get(`/inventory/${id}`),
 create: (data: any) => apiClient.post('/inventory', data),
 update: (id: string, data: any) => apiClient.put(`/inventory/${id}`, data),
 delete: (id: string) => apiClient.delete(`/inventory/${id}`),
};

export const recordsAPI = {
 list: (page = 1, limit = 10, type = '', search = '', filters = {}) => apiClient.get('/records', { params: { page, limit, type, search, ...filters } }),
 get: (id: string) => apiClient.get(`/records/${id}`),
 create: (data: any) => apiClient.post('/records', data),
 update: (id: string, data: any) => apiClient.put(`/records/${id}`, data),
 delete: (id: string) => apiClient.delete(`/records/${id}`),
 updateStatus: (id: string, status: string) => apiClient.patch(`/records/${id}/status`, { status }),
};

export const whatsappAPI = {
 getStatus: () => apiClient.get('/whatsapp/status'),
 sendMessage: (phone: string, message: string, fileData?: string, fileName?: string, fileType?: string) => 
 apiClient.post('/whatsapp/send', { phone, message, fileData, fileName, fileType }),
};

export const refillAPI = {
 list: () => apiClient.get('/pharmacy/refills'),
 create: (data: { medicineName: string; quantityRequested: number; notes?: string }) => 
 apiClient.post('/pharmacy/refills', data),
 update: (id: string, data: { status: string; notes?: string }) => 
 apiClient.put(`/pharmacy/refills/${id}`, data),
};

export const staffAPI = {
 list: (page = 1, limit = 10, filters = {}) => apiClient.get('/staff', { params: { page, limit, ...filters } }),
 get: (id: string) => apiClient.get(`/staff/${id}`),
 create: (data: any) => apiClient.post('/staff', data),
 update: (id: string, data: any) => apiClient.put(`/staff/${id}`, data),
 delete: (id: string) => apiClient.delete(`/staff/${id}`),
};

export const attendanceAPI = {
 list: (page = 1, limit = 10, filters = {}) => apiClient.get('/attendance', { params: { page, limit, ...filters } }),
 get: (id: string) => apiClient.get(`/attendance/${id}`),
 create: (data: any) => apiClient.post('/attendance', data),
 update: (id: string, data: any) => apiClient.put(`/attendance/${id}`, data),
 delete: (id: string) => apiClient.delete(`/attendance/${id}`),
};

export const bloodBankAPI = {
 getStock: () => apiClient.get('/blood-bank/blood-stock'),
 createStock: (data: any) => apiClient.post('/blood-bank/blood-stock', data),
 updateStock: (id: string, data: any) => apiClient.put(`/blood-bank/blood-stock/${id}`, data),
 deleteStock: (id: string) => apiClient.delete(`/blood-bank/blood-stock/${id}`),
 
 getDonors: () => apiClient.get('/blood-bank/blood-donors'),
 createDonor: (data: any) => apiClient.post('/blood-bank/blood-donors', data),
 
 getIssues: () => apiClient.get('/blood-bank/blood-issues'),
 createIssue: (data: any) => apiClient.post('/blood-bank/blood-issues', data),
 updateIssue: (id: string, data: any) => apiClient.put(`/blood-bank/blood-issues/${id}`, data),
 deleteIssue: (id: string) => apiClient.delete(`/blood-bank/blood-issues/${id}`),
 fulfillIssue: (id: string) => apiClient.post(`/blood-bank/blood-issues/${id}/fulfill`, {}),
 
 list: (page = 1, limit = 10, search = '') => apiClient.get('/blood-bank', { params: { page, limit, search } }),
 get: (id: string) => apiClient.get(`/blood-bank/${id}`),
 create: (data: any) => apiClient.post('/blood-bank', data),
 update: (id: string, data: any) => apiClient.put(`/blood-bank/${id}`, data),
 delete: (id: string) => apiClient.delete(`/blood-bank/${id}`),
};

export const notificationAPI = {
 list: () => apiClient.get('/notifications'),
 create: (data: any) => apiClient.post('/notifications', data),
 markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
 markAllAsRead: () => apiClient.post('/notifications/mark-all-read'),
 delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};

export const consentAPI = {
  list: (page = 1, limit = 25, search = '', patientId?: string) => apiClient.get('/consents', { params: { page, limit, search, patientId } }),
  getAuditLog: (id: string) => apiClient.get(`/consents/${id}/audit`),
};

/** Hospital structure: profile, branches, buildings, floors, wards, rooms, beds (all real DB data). */
export type HospitalEntity = 'branches' | 'buildings' | 'floors' | 'wards' | 'rooms' | 'beds';
export const hospitalAPI = {
  summary: () => apiClient.get('/hospital/summary'),
  getProfile: () => apiClient.get('/hospital/profile'),
  saveProfile: (data: any) => apiClient.put('/hospital/profile', data),
  list: (entity: HospitalEntity, params: Record<string, string> = {}) => apiClient.get(`/hospital/${entity}`, { params }),
  create: (entity: HospitalEntity, data: any) => apiClient.post(`/hospital/${entity}`, data),
  update: (entity: HospitalEntity, id: string, data: any) => apiClient.put(`/hospital/${entity}/${id}`, data),
  remove: (entity: HospitalEntity, id: string) => apiClient.delete(`/hospital/${entity}/${id}`),
};

export const patientDocumentAPI = {
  list: (page = 1, limit = 25, search = '', type = '', status = '', patientId?: string) => apiClient.get('/patient-documents', { params: { page, limit, search, type, status, patientId } }),
};

