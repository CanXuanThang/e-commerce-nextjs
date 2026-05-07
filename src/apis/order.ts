import axiosClient from "@/config/axiosClient";
import { BaseResponse } from "@/types/common";
import { Order, OrderRequest } from "@/types/order";

export type StatusOrder = "pending" | "completed" | "cancelled" | "shipping";

export const createOrder = async (
  order: OrderRequest,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post("/orders", order);
  return response.data;
};

export const getOrders = async (): Promise<BaseResponse<any>> => {
  const response = await axiosClient.get("/orders");
  return response.data;
};

export const getAllOrders = async (): Promise<BaseResponse<Order[]>> => {
  const response = await axiosClient.get("/orders/all");
  return response.data;
};

export const deleteOrder = async (
  id: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.delete(`/orders/${id}`);
  return response.data;
};

export const updateStatusOrder = async (
  id: number,
  status: StatusOrder,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.put(`/orders/${id}`, { status: status });
  return response.data;
};

export const resetCount = async (): Promise<BaseResponse<string>> => {
  const response = await axiosClient.get(`/orders/reset-noti`);
  return response.data;
};

export const getCount = async (): Promise<BaseResponse<{ count: number }>> => {
  const response = await axiosClient.get(`/orders/get-noti`);
  return response.data;
};
