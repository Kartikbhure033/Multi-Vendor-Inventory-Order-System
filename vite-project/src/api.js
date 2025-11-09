import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // 👈 enables sending cookies automatically
});

export default API;
