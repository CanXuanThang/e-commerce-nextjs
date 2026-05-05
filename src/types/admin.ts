export type AdminLocale = "vi" | "en";

export type AdminEntityStatus = "active" | "inactive";
export type AdminProductStatus = "draft" | "published" | "archived";
export type AdminOrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

export interface AdminCategory {
  id: number;
  name: string;
}

export interface AdminBanner {
  id: number;
  imageUrl: string;
  order: number;
}

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive?: boolean;
  status?: AdminEntityStatus;
  createdAt: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  categoryId: number;
  sku: string;
  price: number;
  stock: number;
  status: AdminProductStatus;
  description: string;
  images: string[];
}

export interface AdminOrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
  items: AdminOrderItem[];
}
