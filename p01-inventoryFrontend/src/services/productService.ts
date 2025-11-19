import axiosInstance from "@/lib/axios";
import { Product, CreateProductData, ApiResponse } from "@/types";

export const productService = {
  // Get all products (public access)
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  // Get single product (public access)
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (
    data: CreateProductData
  ): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.post("/products", data);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (
    id: string,
    data: Partial<CreateProductData>
  ): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};
