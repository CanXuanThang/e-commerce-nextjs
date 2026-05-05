export interface AddCartItemRequest {
  productId: number;
  quantity: number;
  sizeId: number;
  variantId: number;
  price: number;
}

export interface CartItemApiImage {
  id?: number;
  imageUrl?: string;
  isPrimary?: boolean;
}

export interface CartItemApiSize {
  id?: number;
  size?: string;
  name?: string;
  quantity?: number;
  price?: number;
}

export interface CartItemApiVariant {
  id?: number;
  colorName?: string;
  color?: string;
  colorCode?: string;
  imgUrl?: string;
  images?: CartItemApiImage[];
  sizes?: CartItemApiSize[];
}

export interface CartItemApiProduct {
  id?: number;
  name?: string;
  description?: string;
  discount?: number;
}

export interface CartItemResponse {
  id?: number;
  productId?: number;
  variantId?: number;
  sizeId?: number;
  quantity?: number;
  price?: number;
  imageUrl?: string;
  colorName?: string;
  size?: string;
  sizeName?: string;
  productName?: string;
  discount?: number;
  product?: CartItemApiProduct;
  variant?: CartItemApiVariant;
  productSize?: CartItemApiSize;
  sizeInfo?: CartItemApiSize;
  productImage?: CartItemApiImage;
}

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  sizeId: number;
  product: {
    id: number;
    name: string;
    description: string;
    discount: number;
  };

  variant: {
    id: number;
    colorName: string;
    colorCode: string;
    imgUrl: string | null;
  };

  size: string;
}
