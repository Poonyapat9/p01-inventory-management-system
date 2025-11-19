"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setRequests,
  deleteRequest,
  setLoading,
} from "@/store/slices/requestSlice";
import { setProducts } from "@/store/slices/productSlice";
import { requestService } from "@/services/requestService";
import { productService } from "@/services/productService";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Request, Product } from "@/types";

const RequestsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { requests, loading } = useAppSelector((state) => state.request);
  const { user } = useAppSelector((state) => state.auth);
  const { products } = useAppSelector((state) => state.product);

  useEffect(() => {
    fetchRequests();
    fetchProducts();
  }, []);

  const fetchRequests = async () => {
    try {
      dispatch(setLoading(true));
      const response = await requestService.getAllRequests();
      if (response.success && response.data) {
        dispatch(setRequests(response.data));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        dispatch(setProducts(response.data));
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this request?"))
      return;

    try {
      await requestService.deleteRequest(id);
      dispatch(deleteRequest(id));
      toast.success("Request cancelled successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getProductName = (productId: string | Product): string => {
    if (typeof productId === "object") {
      return productId.name;
    }
    const product = products.find((p) => p._id === productId);
    return product?.name || "Unknown Product";
  };

  const isAdmin = user?.role === "admin";

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction Requests
          </h1>
          <Button onClick={() => router.push("/requests/new")}>
            New Request
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">No requests found</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(
                        new Date(request.transactionDate),
                        "MMM dd, yyyy"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProductName(request.product_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          request.transactionType === "stockIn"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.transactionType === "stockIn"
                          ? "Stock In"
                          : "Stock Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.itemAmount}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof request.user === "object"
                          ? request.user.name
                          : "N/A"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.push(`/requests/${request._id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(request._id)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default RequestsPage;
