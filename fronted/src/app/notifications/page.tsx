"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setNotifications,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setLoading,
} from "@/store/slices/notificationSlice";
import { notificationService } from "@/services/notificationService";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notification
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  useEffect(() => {
    fetchNotifications();

    // Real-time polling: Check for new notifications every 5 seconds
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsRefreshing(true);
      const response = await notificationService.getAllNotifications();
      if (response.success && response.data) {
        dispatch(setNotifications(response.data));
        // Update unread count from the response
        const unreadCount = (response as any).unreadCount || 0;
        dispatch(setUnreadCount(unreadCount));
      }
    } catch (error: any) {
      // Silently fail for background polling to avoid annoying users
      console.error("Failed to fetch notifications:", error);
    } finally {
      dispatch(setLoading(false));
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(markAsRead(id));
      // Refresh to update the count
      await fetchNotifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch(markAllAsRead());
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      dispatch(deleteNotification(id));
      toast.success("Notification deleted");
      // Refresh to update the count
      await fetchNotifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_updated":
        return "✏️";
      case "request_deleted":
        return "🗑️";
      case "request_created":
        return "✨";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "request_updated":
        return "bg-blue-50 border-blue-200";
      case "request_deleted":
        return "bg-red-50 border-red-200";
      case "request_created":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Notifications
              {isRefreshing && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              )}
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="secondary">
              Mark All as Read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-600 text-lg">No notifications yet</p>
              <p className="text-gray-500 text-sm mt-2">
                You'll be notified when admins interact with your requests
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`${
                  !notification.isRead
                    ? getNotificationColor(notification.type)
                    : "bg-white"
                } ${!notification.isRead ? "border-l-4" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3
                          className={`text-base font-semibold ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                          {!notification.isRead && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
