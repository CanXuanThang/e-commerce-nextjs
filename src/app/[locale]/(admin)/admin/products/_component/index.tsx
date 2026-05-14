"use client";

import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import AdminTable, { AdminTableColumn } from "@/component/Admin/AdminTable";
import Selector from "@/component/Selector";
import { useRouter } from "@/i18n/navigation";
import { AdminCategory } from "@/types/admin";
import { Option } from "@/types/common";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CreateOrUpdate from "./CreateOrUpdate";
import DeleteProduct from "./DeleteProduct";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/apis/category";
import { getProductByCategoryId } from "@/apis/product";
import { Product } from "@/types/product";

type DialogMode = "create" | "update" | "delete" | null;

function getStatusClass(status: string) {
  const styles: Record<string, string> = {
    inStock: "bg-green-100 text-green-700",
    outOfStock: "bg-red-100 text-red-700",
  };

  return styles[status] ?? "bg-slate-100 text-slate-700";
}

const checkQuantityProducts = (product: Product) => {
  return product.variants
    .flatMap((v) => v.sizes ?? [])
    .some((size) => size.quantity > 0);
};

export default function ProductsPage() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data } = useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => {
      const data = await getCategories();
      return data.data;
    },
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["get-products"],
    queryFn: () => getProductByCategoryId(Number(selectedCategoryId)),
    enabled: !!selectedCategoryId,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setCategories(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      productsData?.success &&
      productsData?.data &&
      productsData.data.products.length > 0
    ) {
      setProducts(productsData.data.products);
    } else {
      setProducts([]);
    }
  }, [productsData]);

  const categoryOptions: Option[] = categories
    ? [
        { label: t("products.selectCategory"), value: "" },
        ...categories.map((category) => ({
          label: category.name,
          value: String(category.id),
        })),
      ]
    : [{ label: t("products.selectCategory"), value: "" }];

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedProduct(null);
  };

  const openCreate = () => {
    setDialogMode("create");
  };

  const openUpdate = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("update");
  };

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("delete");
  };

  const columns: AdminTableColumn<Product>[] = [
    {
      key: "name",
      label: t("products.fields.name"),
      render: (product) => (
        <p className="font-semibold text-slate-900">{product.name}</p>
      ),
    },
    {
      key: "description",
      label: t("products.fields.description"),
      render: (product) => product.description,
    },
    {
      key: "discount",
      label: t("products.fields.discount"),
      render: (product) => product.discount,
    },
    {
      key: "status",
      label: t("products.fields.status"),
      render: (product) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStatusClass(checkQuantityProducts(product) ? "inStock" : "outOfStock")}`}
        >
          {t(
            `status.${checkQuantityProducts(product) ? "inStock" : "outOfStock"}`,
          )}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      className: "w-36",
      render: (product) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openUpdate(product);
            }}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openDelete(product);
            }}
            className="rounded-xl border border-slate-200 p-2 text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin" },
          { label: t("products.title") },
        ]}
        title={t("products.title")}
        action={
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="min-w-72 space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                {t("products.filterByCategory")}
              </span>
              <Selector
                handleChange={(option) =>
                  setSelectedCategoryId(String(option.value))
                }
                label={t("products.selectCategory")}
                options={categoryOptions}
                value={
                  categoryOptions.find(
                    (option) => String(option.value) === selectedCategoryId,
                  ) ?? null
                }
              />
            </label>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <PlusIcon className="size-5" />
              {t("products.create")}
            </button>
          </div>
        }
      />

      <AdminTable
        columns={columns}
        data={products}
        getRowKey={(product) => product.id}
        emptyText={
          selectedCategoryId
            ? t("products.noProducts")
            : t("products.emptyPrompt")
        }
        onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
        isLoading={isLoading}
      />

      <CreateOrUpdate
        closeDialog={closeDialog}
        dialogMode={dialogMode}
        selectedCategoryId={selectedCategoryId}
        selectedProduct={selectedProduct}
        categoryOptions={categoryOptions}
      />

      {selectedProduct && (
        <DeleteProduct
          closeDialog={closeDialog}
          open={dialogMode === "delete"}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}
