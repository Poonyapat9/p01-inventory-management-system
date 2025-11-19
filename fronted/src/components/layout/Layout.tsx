"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUnreadCount } from "@/store/slices/notificationSlice";
import { notificationService } from "@/services/notificationService";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const previousUnreadCount = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      previousUnreadCount.current = null;
      return;
    }

    // Fetch unread count immediately
    fetchUnreadCount();

    // Poll for new notifications every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Show toast when new notifications arrive (global listener)
  useEffect(() => {
    if (
      isAuthenticated &&
      previousUnreadCount.current !== null &&
      unreadCount > previousUnreadCount.current &&
      pathname !== "/notifications"
    ) {
      const newCount = unreadCount - previousUnreadCount.current;
      toast.info(
        `🔔 You have ${newCount} new notification${newCount > 1 ? "s" : ""}!`,
        {
          position: "top-right",
          autoClose: 5000,
          onClick: () => {
            window.location.href = "/notifications";
          },
          style: {
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "600",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
          },
          className: "notification-toast",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
    if (isAuthenticated) {
      previousUnreadCount.current = unreadCount;
    }
  }, [unreadCount, isAuthenticated, pathname]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        // Backend returns count directly, not in data object
        const count = (response as any).count || 0;
        dispatch(setUnreadCount(count));
      }
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">{children}</main>
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} StockMe
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
