import axios from 'axios'

const BASE_URL = 
    import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

    console.log(BASE_URL)
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Thêm interceptor để thêm token vào headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

export default api;