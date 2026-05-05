export interface EditableProductImage {
  id?: number;
  imageUrl?: string;
  previewUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  file?: File;
}

export interface EditableProductSize {
  id?: number;
  size: string;
  quantity: number;
  price: number;
}

export interface EditableProductVariant {
  id?: number;
  colorName: string;
  colorCode: string;
  sku: string;
  isDefault: boolean;
  sizes: EditableProductSize[];
  images: EditableProductImage[];
}

export interface ProductFormState {
  name: string;
  discount: number;
  categoryId: number;
  description: string;
  variants: EditableProductVariant[];
}
