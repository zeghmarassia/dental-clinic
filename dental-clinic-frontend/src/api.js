import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust port if using 4242
});

export const fetchServices = () => API.get('/services');
export const fetchDoctors = () => API.get('/doctors');
export const createAppointment = (data) => API.post('/appointments', data);

export default API;