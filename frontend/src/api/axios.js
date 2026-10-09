
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem("imsUser"));

        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch {
        localStorage.removeItem("imsUser");
    }

    return config;
});

export default api;
