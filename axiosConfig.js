// src/axiosConfig.js
import axios from "axios";

// Base URL for your backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Automatically send cookies with every request
axios.defaults.withCredentials = true;

export default axios;
