import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const login = (data) => API.post('/login', data);
export const getDashboard = () => API.get('/dashboard');

export const getMembers = () => API.get('/members');
export const addMember = (data) => API.post('/add-member', data);
export const updateMember = (id, data) => API.put(`/update-member/${id}`, data);
export const deleteMember = (id) => API.delete(`/delete-member/${id}`);

export const getMemberships = () => API.get('/memberships');
export const addMembership = (data) => API.post('/add-membership', data);
export const updateMembership = (id, data) => API.put(`/update-membership/${id}`, data);
export const deleteMembership = (id) => API.delete(`/delete-membership/${id}`);

export const getTrainers = () => API.get('/trainers');
export const addTrainer = (data) => API.post('/add-trainer', data);
export const updateTrainer = (id, data) => API.put(`/update-trainer/${id}`, data);
export const deleteTrainer = (id) => API.delete(`/delete-trainer/${id}`);

export const getAttendance = () => API.get('/attendance');
export const lookupMember = (id) => API.get(`/member-lookup/${id}`);
export const markEntry = (data) => API.post('/entry', data);
export const markExit = (data) => API.post('/exit', data);

export const getPayments = () => API.get('/payments');
export const addPayment = (data) => API.post('/add-payment', data);

export default API;
