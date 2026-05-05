export interface Banner {
  id: number;
  imageUrl: string;
  order: number;
}

export interface BannerResponse {
  id: number;
  imageUrl?: string;
  image?: string;
  order: number;
}

export interface UpdateBannerRequest {
  order: number;
  image?: File;
}
