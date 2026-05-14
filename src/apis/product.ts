import axiosClient from "@/config/axiosClient";
import { BaseResponse } from "@/types/common";
import {
  Product,
  ProductByCategoryResponse,
  TopSellingProduct,
  UpdateProductRequest,
} from "@/types/product";

const path = "/products";

export const getProducts = async (): Promise<BaseResponse<Product[]>> => {
  const response = await axiosClient.get(path);
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
): Promise<BaseResponse<ProductByCategoryResponse>> => {
  const response = await axiosClient.get(`${path}/category/${id}`);
  return response.data;
};

export const getBestReviewProducts = async (): Promise<
  BaseResponse<Product[]>
> => {
  const response = await axiosClient.get(`${path}/best-review`);
  return response.data;
};

export const createProduct = async (payload: {
  name: string;
  discount: number;
  categoryId: number;
  description: string;
}): Promise<BaseResponse<Product>> => {
  const response = await axiosClient.post(path, payload);
  return response.data;
};

export const updateProduct = async (
  id: number,
  payload: UpdateProductRequest,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.put(`${path}/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (
  id: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.delete(`${path}/${id}`);
  return response.data;
};

export const createProductDetails = async (
  productId: number,
  payload: FormData,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post(
    `${path}/${productId}/details`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateProductDetails = async (
  productId: number,
  payload: FormData,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.put(
    `${path}/${productId}/details`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getTopSellingProducts = async (
  count?: number,
): Promise<BaseResponse<TopSellingProduct[]>> => {
  const response = await axiosClient.get(`${path}/top-selling/${count ?? 5}`);
  return response.data;
};
