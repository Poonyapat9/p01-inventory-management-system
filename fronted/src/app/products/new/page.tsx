"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { addProduct, setLoading } from "@/store/slices/productSlice";
import { productService } from "@/services/productService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "react-toastify";

const NewProductPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    unit: "",
    picture: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await productService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      if (response.success && response.data) {
        dispatch(addProduct(response.data));
        toast.success("Product created successfully!");
        router.push("/products");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Add New Product
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Product Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />

            <Input
              label="SKU (Stock Keeping Unit)"
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="Enter SKU"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e: any) => handleChange(e)}
                required
                rows={3}
                maxLength={500}
                placeholder="Enter product description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Electronics, Food"
              />

              <Input
                label="Unit"
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                placeholder="e.g., pcs, kg, box"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <Input
                label="Stock Quantity"
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <ImageUpload
              label="Product Image"
              name="picture"
              value={formData.picture}
              onChange={handleImageChange}
              required
              maxSize={5}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                isLoading={isLoading}
              >
                Create Product
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

export default NewProductPage;
