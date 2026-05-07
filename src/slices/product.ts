import { Product } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";

interface SortProduct {
  size: string[];
  sortBy: "highest_price" | "lowest_price";
}

export type ProductState = {
  products: Product[];
  dataSort: Product[];
  sort: SortProduct;
};

const initialState: ProductState = {
  products: [],
  dataSort: [],
  sort: {
    size: [],
    sortBy: "highest_price",
  },
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      const data: Product[] = action.payload;
      state.products = data.filter((x) =>
        x.variants.some((y) => y.sizes.some((z) => z.quantity > 0)),
      );
    },
    setDataSortProduct: (state) => {
      const data = state.products;
      state.dataSort = data;

      const size = state.sort.size;
      const sortBy = state.sort.sortBy;

      const getDisplayPrice = (product: Product) =>
        product.variants?.[0]?.sizes?.[0]?.price ?? 0;

      if (sortBy === "highest_price") {
        state.dataSort = [...state.dataSort].sort(
          (a, b) => getDisplayPrice(b) - getDisplayPrice(a),
        );
      }

      if (sortBy === "lowest_price") {
        state.dataSort = [...state.dataSort].sort(
          (a, b) => getDisplayPrice(a) - getDisplayPrice(b),
        );
      }

      if (size.length > 0) {
        state.dataSort = state.dataSort.filter((product) =>
          product.variants.some((variant) => {
            const availableSizes = new Set(
              variant.sizes.filter((s) => s.quantity > 0).map((s) => s.size),
            );

            return size.every((s) => availableSizes.has(s));
          }),
        );
      }
    },
  },
});

export const { setProduct, setDataSortProduct } = ProductSlice.actions;

export default ProductSlice.reducer;
