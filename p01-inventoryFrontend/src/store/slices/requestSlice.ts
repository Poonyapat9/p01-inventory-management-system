import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestState, Request } from "@/types";

const initialState: RequestState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRequests: (state, action: PayloadAction<Request[]>) => {
      state.requests = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentRequest: (state, action: PayloadAction<Request | null>) => {
      state.currentRequest = action.payload;
    },
    addRequest: (state, action: PayloadAction<Request>) => {
      state.requests.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateRequest: (state, action: PayloadAction<Request>) => {
      const index = state.requests.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      if (state.currentRequest?._id === action.payload._id) {
        state.currentRequest = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((r) => r._id !== action.payload);
      if (state.currentRequest?._id === action.payload) {
        state.currentRequest = null;
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
  setRequests,
  setCurrentRequest,
  addRequest,
  updateRequest,
  deleteRequest,
  clearError,
} = requestSlice.actions;

export default requestSlice.reducer;
