import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api",
});

export default api; 