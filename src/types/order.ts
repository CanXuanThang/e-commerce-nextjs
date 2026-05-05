import { StatusOrder } from "@/apis/order";
import { User } from "./auth";

export interface OrderItemRequest {
  productVariantId: number;
  productSizeId: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  address: string;
  phone: string;
  orderItems: OrderItemRequest[];
  note?: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: StatusOrder;
  address: string;
  phone: string;
  createdAt: string;
  user: User;
  items: OrderItem[];
}
