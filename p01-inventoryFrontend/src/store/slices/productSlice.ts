import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductState, Product } from "@/types";

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?._id === action.payload._id) {
        state.currentProduct = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
      if (state.currentProduct?._id === action.payload) {
        state.currentProduct = null;
      }
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
