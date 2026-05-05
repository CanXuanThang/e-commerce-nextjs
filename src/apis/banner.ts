import { BaseResponse } from "@/types/common";
import axiosClient from "@/config/axiosClient";
import { BannerResponse } from "@/types/banner";

export const getAllBanners = async (): Promise<
  BaseResponse<BannerResponse[]>
> => {
  const response = await axiosClient.get("/banners");
  return response.data;
};

export const createBanner = async (
  body: FormData,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.post("/banners", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBanner = async (
  id: number,
  body: FormData,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.put(`/banners/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBanner = async (
  id: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosClient.delete(`/banners/${id}`);
  return response.data;
};
