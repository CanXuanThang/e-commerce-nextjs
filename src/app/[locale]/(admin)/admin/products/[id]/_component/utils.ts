import { Product, UpdateProductRequest } from "@/types/product";
import {
  EditableProductImage,
  EditableProductSize,
  EditableProductVariant,
  ProductFormState,
} from "./types";

type TranslateFn = (key: string, values?: Record<string, any>) => string;

export function createEmptySize(): EditableProductSize {
  return {
    size: "",
    quantity: 0,
    price: 0,
  };
}

export function createEmptyImage(sortOrder = 1): EditableProductImage {
  return {
    previewUrl: "",
    isPrimary: sortOrder === 1,
    sortOrder,
  };
}

export function createEmptyVariant(isDefault = false): EditableProductVariant {
  return {
    colorName: "",
    colorCode: "#000000",
    sku: "",
    isDefault,
    sizes: [createEmptySize()],
    images: [],
  };
}

export function mapProductToForm(product: Product): ProductFormState {
  const hasDefaultVariant = product.variants.some(
    (variant) => variant.isDefault,
  );
  const variants =
    product.variants.length > 0
      ? product.variants.map((variant, variantIndex) => ({
          id: variant.id,
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          sku: variant.sku,
          isDefault: hasDefaultVariant ? variant.isDefault : variantIndex === 0,
          sizes:
            variant.sizes.length > 0
              ? variant.sizes.map((size) => ({
                  id: size.id,
                  size: size.size,
                  quantity: size.quantity,
                  price: size.price,
                }))
              : [createEmptySize()],
          images:
            variant.images.length > 0
              ? variant.images.map((image, imageIndex) => ({
                  id: image.id,
                  imageUrl: image.imageUrl,
                  previewUrl: image.imageUrl,
                  isPrimary: image.isPrimary,
                  sortOrder: image.sortOrder || imageIndex + 1,
                }))
              : [],
        }))
      : [createEmptyVariant(true)];

  return {
    name: product.name,
    discount: product.discount,
    categoryId: product.categoryId ?? product.category?.id ?? 0,
    description: product.description,
    variants,
  };
}

export function buildProductPayload(
  form: ProductFormState,
): UpdateProductRequest {
  return {
    name: form.name.trim(),
    discount: Number(form.discount) || 0,
    categoryId: Number(form.categoryId),
    description: form.description.trim(),
  };
}

export function revokeObjectUrls(variants: EditableProductVariant[]) {
  variants.forEach((variant) => {
    variant.images.forEach((image) => {
      if (image.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(image.previewUrl);
      }
    });
  });
}

export function buildProductDetailsFormData(form: ProductFormState): FormData {
  const formData = new FormData();
  let fileIndex = 0;

  const variants = form.variants.map((variant, variantIndex) => {
    const hasPrimaryImage = variant.images.some((image) => image.isPrimary);
    const images = variant.images.map((image, imageIndex) => {
      const baseImage = {
        sortOrder: Number(image.sortOrder) || imageIndex + 1,
        isPrimary: hasPrimaryImage ? image.isPrimary : imageIndex === 0,
      };

      if (image.file) {
        formData.append("images", image.file);
        const payload = {
          ...baseImage,
          fileIndex,
          ...(image.id ? { id: image.id } : {}),
        };
        fileIndex += 1;
        return payload;
      }

      return {
        ...baseImage,
        ...(image.id ? { id: image.id } : {}),
        ...(image.imageUrl ? { imageUrl: image.imageUrl } : {}),
      };
    });

    return {
      ...(variant.id ? { id: variant.id } : {}),
      colorName: variant.colorName.trim(),
      colorCode: variant.colorCode.trim() || "#000000",
      sku: variant.sku.trim(),
      isDefault: variant.isDefault || variantIndex === 0,
      sizes: variant.sizes.map((size) => ({
        ...(size.id ? { id: size.id } : {}),
        size: size.size.trim(),
        quantity: Number(size.quantity) || 0,
        price: Number(size.price) || 0,
      })),
      images,
    };
  });

  const defaultIndex = variants.findIndex((variant) => variant.isDefault);
  variants.forEach((variant, index) => {
    variant.isDefault = index === (defaultIndex === -1 ? 0 : defaultIndex);
  });

  formData.append("variants", JSON.stringify(variants));
  return formData;
}

export function validateProductForm(
  t: TranslateFn,
  values: ProductFormState,
): string {
  if (!values.name.trim()) {
    return t("validation.requiredProductName");
  }

  if (!values.categoryId) {
    return t("validation.requiredCategory");
  }

  if (Number(values.discount) < 0) {
    return t("validation.invalidDiscount");
  }

  if (!values.description.trim()) {
    return t("validation.requiredDescription");
  }

  if (values.variants.length === 0) {
    return t("productDetail.validation.requiredVariant");
  }

  for (
    let variantIndex = 0;
    variantIndex < values.variants.length;
    variantIndex += 1
  ) {
    const variant = values.variants[variantIndex];

    if (!variant.colorName.trim()) {
      return t("productDetail.validation.requiredColorName", {
        index: variantIndex + 1,
      });
    }

    if (!variant.sku.trim()) {
      return t("validation.requiredSku");
    }

    if (variant.sizes.length === 0) {
      return t("productDetail.validation.requiredSize", {
        index: variantIndex + 1,
      });
    }

    for (const size of variant.sizes) {
      if (!size.size.trim()) {
        return t("productDetail.validation.invalidSize");
      }

      if (Number(size.quantity) < 0) {
        return t("validation.invalidStock");
      }

      if (Number(size.price) <= 0) {
        return t("validation.invalidPrice");
      }
    }

    if (variant.images.length === 0) {
      return t("productDetail.validation.requiredImage");
    }
  }

  return "";
}
