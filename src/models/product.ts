export interface Product {
  id: number;
  name: string;
  discount: number;
  category: Category;
  variants: Variant[];
  description: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  colorName: string;
  colorCode: string;
  images: ProductImage[];
  sizes: Size[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Size {
  id: number;
  size: string;
  quantity: number;
  price: number;
}
