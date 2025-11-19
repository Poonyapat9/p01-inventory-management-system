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

    // Validate telephone number (must be exactly 10 digits)
    const telRegex = /^\d{10}$/;
    if (!telRegex.test(formData.tel)) {
      toast.error("Telephone number must be exactly 10 digits");
      return;
    }

    // Validate role selection
    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log("Sending registration data:", registerData); // Debug log
      const response = await authService.register(registerData as any);

      if (response.success && response.data && response.token) {
        dispatch(
          registerSuccess({
            user: response.data,
            token: response.token,
          })
        );
        toast.success("Registration successful!");
        router.push("/products");
      }
    } catch (error: any) {
      let errorMessage = error.message || "Registration failed";

      // Check for duplicate email error
      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("E11000") ||
        errorMessage.includes("unique")
      ) {
        errorMessage =
          "This email is already registered. Please use a different email or try logging in.";
      }

      console.error("Registration error:", error); // Debug log
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />

            <Input
              label="Telephone"
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              required
              pattern="\d{10}"
              maxLength={10}
              placeholder="0812345678 (10 digits)"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="Select your role"
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
              placeholder="Enter password (min 6 characters)"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
