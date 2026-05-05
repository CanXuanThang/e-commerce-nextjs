"use client";

import {
  createProductDetails,
  getProductById,
  updateProduct,
  updateProductDetails,
} from "@/apis/product";
import { getCategories } from "@/apis/category";
import { setLoading } from "@/slices/common";
import { Option } from "@/types/common";
import { Category } from "@/types/product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import ProductGeneralSection from "./ProductGeneralSection";
import ProductSummaryCards from "./ProductSummaryCards";
import {
  EditableProductImage,
  EditableProductSize,
  EditableProductVariant,
  ProductFormState,
} from "./types";
import {
  buildProductDetailsFormData,
  buildProductPayload,
  createEmptySize,
  createEmptyVariant,
  mapProductToForm,
  revokeObjectUrls,
  validateProductForm,
} from "./utils";
import VariantAccordion from "./VariantAccordion";

interface Props {
  productId: number;
}

export default function ProductDetail({ productId }: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const [form, setForm] = useState<ProductFormState | null>(null);
  const currentVariantsRef = useRef<EditableProductVariant[]>([]);

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const response = await getCategories();
      return (response.data ?? []) as Category[];
    },
  });

  const productQuery = useQuery({
    queryKey: ["admin-product-detail", productId],
    queryFn: () => getProductById(productId),
  });

  useEffect(() => {
    if (productQuery.data?.success && productQuery.data.data) {
      revokeObjectUrls(currentVariantsRef.current);
      const nextForm = mapProductToForm(productQuery.data.data);
      currentVariantsRef.current = nextForm.variants;
      setForm(nextForm);
    }
  }, [productQuery.data]);

  useEffect(() => {
    currentVariantsRef.current = form?.variants ?? [];
  }, [form]);

  useEffect(() => {
    return () => {
      revokeObjectUrls(currentVariantsRef.current);
    };
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormState) => {
      const productResponse = await updateProduct(
        productId,
        buildProductPayload(values),
      );

      if (!productResponse.success) {
        throw new Error(productResponse.message);
      }

      const detailsFormData = buildProductDetailsFormData(values);
      const hasExistingVariants =
        (productQuery.data?.data?.variants?.length ?? 0) > 0;

      const detailResponse = hasExistingVariants
        ? await updateProductDetails(productId, detailsFormData)
        : await createProductDetails(productId, detailsFormData);

      if (!detailResponse.success) {
        throw new Error(detailResponse.message);
      }

      return detailResponse;
    },
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (response) => {
      toast.success(response.message || t("toast.updated"));
      await productQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  const updateGeneralField = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateVariantField = <K extends keyof EditableProductVariant>(
    variantIndex: number,
    field: K,
    value: EditableProductVariant[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        [field]: value,
      };

      return { ...current, variants };
    });
  };

  const updateSizeField = <K extends keyof EditableProductSize>(
    variantIndex: number,
    sizeIndex: number,
    field: K,
    value: EditableProductSize[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      const sizes = [...variants[variantIndex].sizes];
      sizes[sizeIndex] = {
        ...sizes[sizeIndex],
        [field]: value,
      };
      variants[variantIndex] = {
        ...variants[variantIndex],
        sizes,
      };

      return { ...current, variants };
    });
  };

  const updateImageField = <K extends keyof EditableProductImage>(
    variantIndex: number,
    imageIndex: number,
    field: K,
    value: EditableProductImage[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      const images = [...variants[variantIndex].images];
      images[imageIndex] = {
        ...images[imageIndex],
        [field]: value,
      };
      variants[variantIndex] = {
        ...variants[variantIndex],
        images,
      };

      return { ...current, variants };
    });
  };

  const addVariant = () => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: [
          ...current.variants,
          createEmptyVariant(current.variants.length === 0),
        ],
      };
    });
  };

  const removeVariant = (variantIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variantToRemove = current.variants[variantIndex];
      revokeObjectUrls([variantToRemove]);

      const variants = current.variants.filter(
        (_, index) => index !== variantIndex,
      );

      if (
        variants.length > 0 &&
        !variants.some((variant) => variant.isDefault)
      ) {
        variants[0] = {
          ...variants[0],
          isDefault: true,
        };
      }

      return { ...current, variants };
    });
  };

  const setDefaultVariant = (variantIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.map((variant, index) => ({
          ...variant,
          isDefault: index === variantIndex,
        })),
      };
    });
  };

  const addSize = (variantIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        sizes: [...variants[variantIndex].sizes, createEmptySize()],
      };

      return { ...current, variants };
    });
  };

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        sizes: variants[variantIndex].sizes.filter(
          (_, index) => index !== sizeIndex,
        ),
      };

      return { ...current, variants };
    });
  };

  const addImages = (variantIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      const currentImages = variants[variantIndex].images;
      const hasPrimaryImage = currentImages.some((image) => image.isPrimary);
      const nextImages = Array.from(files).map((file, index) => ({
        file,
        imageUrl: undefined,
        previewUrl: URL.createObjectURL(file),
        isPrimary:
          !hasPrimaryImage && currentImages.length === 0 && index === 0,
        sortOrder: currentImages.length + index + 1,
      }));

      variants[variantIndex] = {
        ...variants[variantIndex],
        images: [...currentImages, ...nextImages],
      };

      return { ...current, variants };
    });
  };

  const removeImage = (variantIndex: number, imageIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      const imageToRemove = variants[variantIndex].images[imageIndex];

      if (imageToRemove?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      const images = variants[variantIndex].images.filter(
        (_, index) => index !== imageIndex,
      );

      if (images.length > 0 && !images.some((image) => image.isPrimary)) {
        images[0] = {
          ...images[0],
          isPrimary: true,
        };
      }

      variants[variantIndex] = {
        ...variants[variantIndex],
        images,
      };

      return { ...current, variants };
    });
  };

  const setPrimaryImage = (variantIndex: number, imageIndex: number) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const variants = [...current.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        images: variants[variantIndex].images.map((image, index) => ({
          ...image,
          isPrimary: index === imageIndex,
        })),
      };

      return { ...current, variants };
    });
  };

  const resetForm = () => {
    if (!productQuery.data?.success || !productQuery.data.data) {
      return;
    }

    revokeObjectUrls(currentVariantsRef.current);
    const nextForm = mapProductToForm(productQuery.data.data);
    currentVariantsRef.current = nextForm.variants;
    setForm(nextForm);
  };

  const onSave = () => {
    if (!form) {
      return;
    }

    const errorMessage = validateProductForm(t, form);

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    saveMutation.mutate(form);
  };

  useEffect(() => {
    dispatch(setLoading(productQuery.isLoading));
  }, [productQuery.isLoading]);

  if (!productQuery.data?.success || !productQuery.data.data) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        {t("productDetail.notFound")}
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        {t("productDetail.loading")}
      </div>
    );
  }

  const categoryOptions: Option[] = (categoriesQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  );
  const isCreateDetailsMode = productQuery.data.data.variants.length === 0;

  return (
    <div className="space-y-6">
      <ProductSummaryCards categoryOptions={categoryOptions} form={form} />

      <ProductGeneralSection
        form={form}
        categoryOptions={categoryOptions}
        isCreateDetailsMode={isCreateDetailsMode}
        isSaving={saveMutation.isPending}
        onFieldChange={updateGeneralField}
        onReset={resetForm}
        onSave={onSave}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-950">
                {t("productDetail.variants")}
              </h2>
              {isCreateDetailsMode ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {t("productDetail.noVariantsYet")}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t("productDetail.variantsHint")}
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
          >
            <PlusIcon className="size-4" />
            {t("productDetail.addVariant")}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {form.variants.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                {t("productDetail.emptyVariants")}
              </p>
            </div>
          ) : (
            form.variants.map((variant, variantIndex) => (
              <VariantAccordion
                key={`variant-${variant.id ?? variantIndex}`}
                variant={variant}
                variantIndex={variantIndex}
                defaultOpen={variantIndex === 0}
                onSetDefaultVariant={() => setDefaultVariant(variantIndex)}
                onRemoveVariant={() => removeVariant(variantIndex)}
                onUpdateVariantField={(field, value) =>
                  updateVariantField(variantIndex, field, value)
                }
                onAddSize={() => addSize(variantIndex)}
                onRemoveSize={(sizeIndex) =>
                  removeSize(variantIndex, sizeIndex)
                }
                onUpdateSize={(sizeIndex, field, value) =>
                  updateSizeField(
                    variantIndex,
                    sizeIndex,
                    field as keyof EditableProductSize,
                    value as EditableProductSize[keyof EditableProductSize],
                  )
                }
                onAddImages={(files) => addImages(variantIndex, files)}
                onRemoveImage={(imageIndex) =>
                  removeImage(variantIndex, imageIndex)
                }
                onSetPrimaryImage={(imageIndex) =>
                  setPrimaryImage(variantIndex, imageIndex)
                }
                onUpdateImage={(imageIndex, field, value) =>
                  updateImageField(
                    variantIndex,
                    imageIndex,
                    field as keyof EditableProductImage,
                    value as EditableProductImage[keyof EditableProductImage],
                  )
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
