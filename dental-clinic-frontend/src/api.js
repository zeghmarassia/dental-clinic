import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dental-clinic-kzp9.onrender.com/api',
});

// Automatically append JWT token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Client endpoints
export const fetchServices = () => API.get('/services');
export const fetchDoctors = () => API.get('/doctors');
export const createAppointment = (data) => API.post('/appointments', data);

// Admin endpoints
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const fetchAppointments = () => API.get('/appointments');
export const updateAppointmentStatus = (id, status) => API.patch(`/appointments/${id}/status`, { status });

export const fetchBookedSlots = (doctorId, date) => API.get(`/appointments/booked-slots?doctor_id=${doctorId}&date=${date}`);
export default API;