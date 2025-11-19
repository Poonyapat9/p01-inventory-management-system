"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notification);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold hover:text-primary-100 transition-colors"
            >
              StockMe
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/products"
                className="hover:text-primary-100 transition-colors px-3 py-2 rounded-md"
              >
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/requests"
                    className="hover:text-primary-100 transition-colors px-3 py-2 rounded-md"
                  >
                    Requests
                  </Link>
                  <Link
                    href="/notifications"
                    className="hover:text-primary-100 transition-colors px-3 py-2 rounded-md relative"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{user?.name}</span>
                  <span className="ml-2 px-2 py-1 bg-primary-700 rounded text-xs">
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hover:text-primary-100 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
