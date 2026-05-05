import { CartItem } from "@/types/cartItem";
import { createSlice } from "@reduxjs/toolkit";

export type CartItemStates = {
  cartItems: CartItem[];
  orderItems: CartItem[];
};

const initialState: CartItemStates = {
  cartItems: [],
  orderItems: [],
};

const CartItemSlice = createSlice({
  name: "cart-item",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      state.cartItems = action.payload;
    },
    setOrderItem: (state, action) => {
      state.orderItems = action.payload;
    },
  },
});

export const { setCartItem, setOrderItem } = CartItemSlice.actions;

export default CartItemSlice.reducer;
