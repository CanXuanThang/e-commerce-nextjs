import { LoginRequest, LoginResponse } from "@/models/auth";
import { BaseResponse } from "@/models/common";
import axiosClient from "@/config/axiosClient";

export const login = async (
  request: LoginRequest,
): Promise<BaseResponse<LoginResponse>> => {
  const response = await axiosClient.post("/auth/login", request);
  return response.data;
};
