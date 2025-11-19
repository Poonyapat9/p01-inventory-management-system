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
    <nav className="bg-white border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              StockMe
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link
                href="/products"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg"
              >
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/requests"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg"
                  >
                    Requests
                  </Link>
                  <Link
                    href="/notifications"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors px-4 py-2 rounded-lg relative"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
                <span className="text-sm text-gray-700">
                  {user?.name}
                  {user?.role && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all"
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
