import axiosClient from "@/config/axiosClient";
import { AddCartItemRequest, CartItem } from "@/types/cartItem";
import { BaseResponse } from "@/types/common";

const path = "/cart-items";

export const getCartItems = async (): Promise<BaseResponse<CartItem[]>> => {
  const response = await axiosClient.get(path);
  return response.data;
};

export const addCartItem = async (
  request: AddCartItemRequest,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post(path, request);
  return response.data;
};
