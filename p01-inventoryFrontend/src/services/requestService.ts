import axiosInstance from "@/lib/axios";
import { Request, CreateRequestData, ApiResponse } from "@/types";

export const requestService = {
  // Get all requests (admin sees all, staff sees own)
  getAllRequests: async (): Promise<ApiResponse<Request[]>> => {
    const response = await axiosInstance.get("/requests");
    return response.data;
  },

  // Get single request
  getRequest: async (id: string): Promise<ApiResponse<Request>> => {
    const response = await axiosInstance.get(`/requests/${id}`);
    return response.data;
  },

  // Create request (authenticated users)
  createRequest: async (
    data: CreateRequestData
  ): Promise<ApiResponse<Request>> => {
    const response = await axiosInstance.post("/requests", data);
    return response.data;
  },

  // Update request
  updateRequest: async (
    id: string,
    data: Partial<CreateRequestData>
  ): Promise<ApiResponse<Request>> => {
    const response = await axiosInstance.put(`/requests/${id}`, data);
    return response.data;
  },

  // Delete request (cancel request)
  deleteRequest: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/requests/${id}`);
    return response.data;
  },
};
