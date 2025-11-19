"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setProducts,
  deleteProduct,
  setLoading,
  setError,
} from "@/store/slices/productSlice";
import { productService } from "@/services/productService";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { Product } from "@/types";

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        dispatch(setProducts(response.data));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await productService.deleteProduct(id);
      dispatch(deleteProduct(id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {isAuthenticated && isAdmin && (
            <Button onClick={() => router.push("/products/new")}>
              Add Product
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No products found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      product.picture ||
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> $
                    {product.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Stock:</span>{" "}
                    {product.stockQuantity} {product.unit}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/products/${product._id}`)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  {isAuthenticated && isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          router.push(`/products/${product._id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
