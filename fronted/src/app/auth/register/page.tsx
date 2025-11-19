"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import {
  registerSuccess,
  setError,
  setLoading,
} from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    role: "" as "" | "admin" | "staff",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const telRegex = /^\d{10}$/;
    if (!telRegex.test(formData.tel)) {
      toast.error("Telephone number must be exactly 10 digits");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData as any);

      if (response.success && response.data && response.token) {
        dispatch(
          registerSuccess({
            user: response.data,
            token: response.token,
          })
        );
        toast.success("Account created successfully!");
        router.push("/products");
      }
    } catch (error: any) {
      let errorMessage = error.message || "Registration failed";

      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("E11000") ||
        errorMessage.includes("unique")
      ) {
        errorMessage =
          "This email is already registered. Please use a different email.";
      }

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold">StockMe</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Start managing smarter today.</h1>
            <p className="text-lg text-indigo-100 mb-8">
              Create your account and join businesses worldwide using StockMe for efficient inventory management.
            </p>
          </div>
        </div>
        
        <div className="text-indigo-200 text-sm">
          © 2024 StockMe Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-stone-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Phone"
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              required
              pattern="\d{10}"
              maxLength={10}
              placeholder="10-digit phone number"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="Select role"
              options={[
                { value: "staff", label: "Staff" },
                { value: "admin", label: "Admin" },
              ]}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
