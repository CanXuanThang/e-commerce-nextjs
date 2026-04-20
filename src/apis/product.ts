import axiosClient from "@/config/axiosClient";
import { BaseResponse } from "@/models/common";
import { Product } from "@/models/product";

const path = "/products";

export const getProducts = async (): Promise<BaseResponse<Product[]>> => {
  const response = await axiosClient.post(path);
  return response.data;
};

export const getProductById = async (
  id: number,
): Promise<BaseResponse<Product>> => {
  const response = await axiosClient.get(`${path}/${id}`);
  return response.data;
};

export const getProductByCategoryId = async (
  id: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.get(`${path}/category/${id}`);
  return response.data;
};
