import {
  AdminBanner,
  AdminCategory,
  AdminOrder,
  AdminProduct,
  AdminUserRecord,
} from "@/types/admin";
import {
  adminBannerSeed,
  adminOrderSeed,
  adminProductSeed,
  adminUserSeed,
} from "@/data/admin";

export const adminStorageKeys = {
  users: "admin-users",
  categories: "admin-categories",
  banners: "admin-banners",
  products: "admin-products",
  orders: "admin-orders",
} as const;

type AdminStorageMap = {
  [adminStorageKeys.users]: AdminUserRecord[];
  [adminStorageKeys.banners]: AdminBanner[];
  [adminStorageKeys.products]: AdminProduct[];
  [adminStorageKeys.orders]: AdminOrder[];
};

const adminStorageDefaults: AdminStorageMap = {
  [adminStorageKeys.users]: adminUserSeed,
  [adminStorageKeys.banners]: adminBannerSeed,
  [adminStorageKeys.products]: adminProductSeed,
  [adminStorageKeys.orders]: adminOrderSeed,
};

export function readAdminCollection<K extends keyof AdminStorageMap>(
  key: K,
): AdminStorageMap[K] {
  if (typeof window === "undefined") {
    return adminStorageDefaults[key];
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    window.localStorage.setItem(key, JSON.stringify(adminStorageDefaults[key]));
    return adminStorageDefaults[key];
  }

  try {
    return JSON.parse(rawValue) as AdminStorageMap[K];
  } catch {
    window.localStorage.setItem(key, JSON.stringify(adminStorageDefaults[key]));
    return adminStorageDefaults[key];
  }
}

export function writeAdminCollection<K extends keyof AdminStorageMap>(
  key: K,
  value: AdminStorageMap[K],
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getNextId(items: Array<{ id: number }>) {
  if (items.length === 0) {
    return 1;
  }

  return Math.max(...items.map((item) => item.id)) + 1;
}

export function formatAdminCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}
