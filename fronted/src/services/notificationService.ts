import axiosInstance from "@/lib/axios";
import { Notification, ApiResponse } from "@/types";

export const notificationService = {
  // Get all notifications
  getAllNotifications: async (): Promise<
    ApiResponse<Notification[]> & { unreadCount?: number }
  > => {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await axiosInstance.get("/notifications/unread-count");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.put("/notifications/read-all");
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },
};
