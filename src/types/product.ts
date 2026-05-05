export interface Product {
  id: number;
  name: string;
  discount: number;
  category: Category;
  variants: Variant[];
  description: string;
  categoryId?: number;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

export interface Variant {
  id: number;
  colorName: string;
  colorCode: string;
  sku: string;
  isDefault: boolean;
  images: ProductImage[];
  sizes: Size[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Size {
  id: number;
  size: string;
  quantity: number;
  price: number;
}

export interface ProductByCategoryResponse {
  category: Category;
  products: Product[];
}

export interface UpdateProductRequest {
  name: string;
  discount: number;
  categoryId: number;
  description: string;
}

export interface UpdateProductDetailImageRequest {
  id?: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface UpdateProductDetailSizeRequest {
  id?: number;
  size: string;
  quantity: number;
  price: number;
}

export interface UpdateProductDetailVariantRequest {
  id?: number;
  colorName: string;
  colorCode: string;
  sku: string;
  isDefault: boolean;
  sizes: UpdateProductDetailSizeRequest[];
  images: UpdateProductDetailImageRequest[];
}

export interface UpdateProductDetailsRequest {
  variants: UpdateProductDetailVariantRequest[];
}
