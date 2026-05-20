import {
  BaseResponse,
  PaginationRequest,
  PaginationResponse,
} from "@/types/common";
import axiosClient from "@/config/axiosClient";
import { CreateUserPayload, UserResponse } from "@/types/user";

const path = "/users";

export const getUsers = async (
  params: PaginationRequest,
): Promise<BaseResponse<PaginationResponse<UserResponse[]>>> => {
  const response = await axiosClient.get(path, { params });
  return response.data;
};

export const createUser = async (
  payload: CreateUserPayload,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post(path, payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<BaseResponse<string>> => {
  const response = await axiosClient.delete(`${path}/${id}`);
  return response.data;
};
