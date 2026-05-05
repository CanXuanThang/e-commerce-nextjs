import { createSlice } from "@reduxjs/toolkit";

export type CommonStates = {
  isLoading: boolean;
};

const initialState: CommonStates = {
  isLoading: false,
};

const CommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = CommonSlice.actions;

export default CommonSlice.reducer;
