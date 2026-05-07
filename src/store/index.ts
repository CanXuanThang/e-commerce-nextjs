import { configureStore } from "@reduxjs/toolkit";
import CommonSlice from "@/slices/common";
import CartItemSlice from "@/slices/cartItem";
import ProductSlice from "@/slices/product";

export const store = configureStore({
  reducer: {
    common: CommonSlice,
    cartItem: CartItemSlice,
    product: ProductSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
