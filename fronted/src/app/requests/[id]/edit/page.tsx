"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateRequest, setLoading } from "@/store/slices/requestSlice";
import { setProducts } from "@/store/slices/productSlice";
import { requestService } from "@/services/requestService";
import { productService } from "@/services/productService";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-toastify";

const EditRequestPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoadingState] = useState(true);
  const [formData, setFormData] = useState({
    transactionDate: "",
    transactionType: "stockIn" as "stockIn" | "stockOut",
    itemAmount: "",
    product_id: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchRequest();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        dispatch(setProducts(response.data));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoadingState(true);
      const response = await requestService.getRequest(id);
      if (response.success && response.data) {
        const request = response.data;
        setFormData({
          transactionDate: new Date(request.transactionDate)
            .toISOString()
            .split("T")[0],
          transactionType: request.transactionType,
          itemAmount: request.itemAmount.toString(),
          product_id:
            typeof request.product_id === "object"
              ? request.product_id._id
              : request.product_id,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch request");
      router.push("/requests");
    } finally {
      setLoadingState(false);
    }
  };

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

    const amount = parseInt(formData.itemAmount);

    // Validation for stock-out by staff
    if (user?.role === "staff" && formData.transactionType === "stockOut") {
      if (amount > 50) {
        toast.error("Staff cannot request stock-out more than 50 units");
        return;
      }
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const requestData = {
        ...formData,
        itemAmount: amount,
      };

      const response = await requestService.updateRequest(id, requestData);
      if (response.success && response.data) {
        dispatch(updateRequest(response.data));
        toast.success("Request updated successfully!");
        router.push("/requests");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update request");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Edit Transaction Request
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Transaction Date"
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />

            <Select
              label="Transaction Type"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              required
              options={[
                { value: "stockIn", label: "Stock In" },
                { value: "stockOut", label: "Stock Out" },
              ]}
            />

            <Select
              label="Product"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Select a product" },
                ...products.map((product) => ({
                  value: product._id,
                  label: `${product.name} (${product.sku}) - Stock: ${product.stockQuantity} ${product.unit}`,
                })),
              ]}
            />

            <Input
              label="Amount"
              type="number"
              name="itemAmount"
              value={formData.itemAmount}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter amount"
            />

            {user?.role === "staff" &&
              formData.transactionType === "stockOut" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Staff members can request stock-out
                    up to 50 units maximum.
                  </p>
                </div>
              )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                isLoading={isLoading}
              >
                Update Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default EditRequestPage;
