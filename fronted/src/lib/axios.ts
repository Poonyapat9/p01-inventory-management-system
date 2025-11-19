import axios from "axios";
import { store } from "@/store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://stockme-backend.vercel.app/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message =
        error.response.data?.error ||
        error.response.data?.msg ||
        error.response.data?.message ||
        "An error occurred";

      // Log for debugging
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Handle unauthorized errors
      if (error.response.status === 401) {
        // Token expired or invalid - could trigger logout here
        if (typeof window !== "undefined") {
          console.error("Unauthorized access - please login again");
        }
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error("No response from server"));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
