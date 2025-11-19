export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: "admin" | "staff";
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ActivityLog {
  action: "created" | "updated" | "deleted";
  performedBy: string | User;
  performedAt: string;
  details?: string;
}

export interface Request {
  _id: string;
  transactionDate: string;
  transactionType: "stockIn" | "stockOut";
  itemAmount: number;
  user: string | User;
  product_id: string | Product;
  lastModifiedBy?: string | User;
  deletedBy?: string | User;
  deletedAt?: string;
  activityLog?: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface RequestState {
  requests: Request[];
  currentRequest: Request | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  tel: string;
  role: "admin" | "staff";
  password: string;
}

export interface CreateProductData {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
}

export interface CreateRequestData {
  transactionDate: string;
  transactionType: "stockIn" | "stockOut";
  itemAmount: number;
  product_id: string;
}

export interface Notification {
  _id: string;
  recipient: string | User;
  sender: string | User;
  type: "request_updated" | "request_deleted" | "request_created";
  title: string;
  message: string;
  relatedRequest?: string;
  relatedProduct?: string | Product;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  token?: string;
  message?: string;
  notification?: {
    action: string;
    performedBy: string;
    performedByRole: string;
    requestOwner: string;
    timestamp: string;
  };
}
