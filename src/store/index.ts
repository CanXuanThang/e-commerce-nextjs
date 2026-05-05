import { configureStore } from "@reduxjs/toolkit";
import CommonSlice from "@/slices/common";
import CartItem from "@/slices/cartItem";

export const store = configureStore({
  reducer: {
    common: CommonSlice,
    cartItem: CartItem,
  },
});

export type RootState = ReturnType<typeof store.getState>;
