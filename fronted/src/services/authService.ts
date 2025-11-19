import axiosInstance from "@/lib/axios";
import { LoginCredentials, RegisterData, ApiResponse, User } from "@/types";

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post("/auth/register", data);
    const { token, _id, name, email, success } = response.data;
    return {
      success,
      data: {
        _id,
        name,
        email,
        tel: data.tel,
        role: data.role,
        createdAt: new Date().toISOString(),
      },
      token,
    };
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    const loginResponse = await axiosInstance.post("/auth/login", credentials);
    const token = loginResponse.data.token;

    // Fetch full user profile to get role and tel
    const profileResponse = await axiosInstance.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: profileResponse.data.data,
      token: token,
    };
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
  },
};
