"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { healthService } from "@/services/healthService";
import { toast } from "react-toastify";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    const checkBackend = async () => {
      const isHealthy = await healthService.checkHealth();
      setBackendStatus(isHealthy ? "online" : "offline");

      if (!isHealthy) {
        toast.error(
          "⚠️ Backend server is offline. Please start the backend to use the application."
        );

        // If user is authenticated but backend is down, logout to prevent confusion
        if (isAuthenticated) {
          toast.warning(
            "You have been logged out because the backend is unavailable."
          );
          dispatch(logout());
        }
      }
    };

    checkBackend();

    // Check every 30 seconds if backend is offline
    const interval = setInterval(() => {
      if (backendStatus === "offline") {
        checkBackend();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, backendStatus, dispatch]);

  return (
    <div className="space-y-12">
      {/* Backend Status Banner */}
      {backendStatus === "offline" && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Backend Server Offline</p>
              <p className="text-sm">
                Please start the backend server at{" "}
                <code className="bg-red-200 px-1 rounded">
                  http://localhost:5000
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      {backendStatus === "checking" && (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Checking backend connection...</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to StockMe</h1>
        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => router.push("/auth/register")}
              className="bg-white text-blue-600 hover:bg-gray-100"
              disabled={backendStatus === "offline"}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/auth/login")}
              className="border-2 border-white text-white hover:bg-blue-700"
              disabled={backendStatus === "offline"}
            >
              Sign In
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">
              Welcome back, <span className="font-bold">{user?.name}</span>!
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/products")}
              className="bg-white text-blue-600 hover:bg-gray-100"
              disabled={backendStatus === "offline"}
            >
              View Products
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
