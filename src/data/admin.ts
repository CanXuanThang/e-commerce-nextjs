import {
  AdminBanner,
  AdminOrder,
  AdminUserRecord,
  AdminProduct,
} from "@/types/admin";

export const adminUserSeed: AdminUserRecord[] = [
  {
    id: 1,
    name: "Nguyen Minh Anh",
    email: "minhanh@ecommerce.vn",
    phone: "0901234567",
    role: "Admin",
    status: "active",
    createdAt: "2026-04-02",
  },
  {
    id: 2,
    name: "Tran Thu Ha",
    email: "thuha@ecommerce.vn",
    phone: "0912345678",
    role: "Editor",
    status: "active",
    createdAt: "2026-04-10",
  },
  {
    id: 3,
    name: "Le Hoang Nam",
    email: "hoangnam@ecommerce.vn",
    phone: "0988123456",
    role: "Support",
    status: "inactive",
    createdAt: "2026-04-14",
  },
];

export const adminBannerSeed: AdminBanner[] = [
  {
    id: 1,
    imageUrl: "/product.webp",
    order: 1,
  },
  {
    id: 2,
    imageUrl: "/product-1.webp",
    order: 2,
  },
];

export const adminProductSeed: AdminProduct[] = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    categoryId: 1,
    sku: "MEN-001",
    price: 690000,
    stock: 22,
    status: "published",
    description:
      "Cotton oxford shirt with regular fit, button-down collar and premium stitching.",
    images: ["/product.webp", "/product-1.webp"],
  },
  {
    id: 2,
    name: "Tailored Linen Blazer",
    categoryId: 1,
    sku: "MEN-002",
    price: 1490000,
    stock: 8,
    status: "draft",
    description:
      "Lightweight blazer for smart casual looks with breathable linen blend fabric.",
    images: ["/product-1.webp"],
  },
  {
    id: 3,
    name: "Pleated Midi Dress",
    categoryId: 2,
    sku: "WOMEN-001",
    price: 1190000,
    stock: 14,
    status: "published",
    description:
      "Soft-touch midi dress with pleated skirt and hidden back zipper.",
    images: ["/product.webp"],
  },
  {
    id: 4,
    name: "Cropped Knit Cardigan",
    categoryId: 2,
    sku: "WOMEN-002",
    price: 870000,
    stock: 30,
    status: "archived",
    description:
      "Button-front cardigan with a cropped silhouette and fine rib cuffs.",
    images: ["/product-1.webp"],
  },
  {
    id: 5,
    name: "Leather Belt Signature",
    categoryId: 3,
    sku: "ACC-001",
    price: 520000,
    stock: 17,
    status: "published",
    description:
      "Genuine leather belt with brushed alloy buckle and clean matte finish.",
    images: ["/product.webp"],
  },
];

export const adminOrderSeed: AdminOrder[] = [
  {
    id: 1,
    code: "ORD-202604-001",
    customerName: "Pham Bao Chau",
    phone: "0933444555",
    address: "12 Nguyen Hue, District 1, Ho Chi Minh City",
    total: 1880000,
    status: "pending",
    createdAt: "2026-04-20",
    items: [
      {
        id: 1,
        productName: "Classic Oxford Shirt",
        quantity: 1,
        price: 690000,
      },
      {
        id: 2,
        productName: "Leather Belt Signature",
        quantity: 1,
        price: 520000,
      },
    ],
  },
  {
    id: 2,
    code: "ORD-202604-002",
    customerName: "Vo Gia Huy",
    phone: "0944222333",
    address: "88 Le Loi, Hai Chau, Da Nang",
    total: 2380000,
    status: "shipping",
    createdAt: "2026-04-23",
    items: [
      { id: 3, productName: "Pleated Midi Dress", quantity: 2, price: 1190000 },
    ],
  },
  {
    id: 3,
    code: "ORD-202604-003",
    customerName: "Do Khanh Linh",
    phone: "0977555333",
    address: "24 Tran Duy Hung, Cau Giay, Hanoi",
    total: 1490000,
    status: "completed",
    createdAt: "2026-04-25",
    items: [
      {
        id: 4,
        productName: "Tailored Linen Blazer",
        quantity: 1,
        price: 1490000,
      },
    ],
  },
];
