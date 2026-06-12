import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with every request
});

// We no longer need the interceptor because the token is securely handled via HttpOnly cookies


export default API;
