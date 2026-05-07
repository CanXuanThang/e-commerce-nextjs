import { BaseResponse } from "@/types/common";
import axiosClient from "@/config/axiosClient";
import { CategoryResponse, UpdateCategoryRequest } from "@/types/category";

export const getCategories = async (): Promise<
  BaseResponse<CategoryResponse[]>
> => {
  const response = await axiosClient.get("/categories");
  return response.data;
};

export const createCategory = async (
  body: UpdateCategoryRequest,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post("/categories", body);
  return response.data;
};

export const updateCategory = async (
  id: number,
  body: UpdateCategoryRequest,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.put(`/categories/${id}`, body);
  return response.data;
};

export const deleteCategory = async (
  id: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
};

export const getCategoriesById = async (
  id: number,
): Promise<BaseResponse<CategoryResponse[]>> => {
  const response = await axiosClient.get(`/categories/${id}`);
  return response.data;
};
