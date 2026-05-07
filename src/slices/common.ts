import { createSlice } from "@reduxjs/toolkit";

export type CommonStates = {
  isLoading: boolean;
  countNotiAdmin: number;
};

const initialState: CommonStates = {
  isLoading: false,
  countNotiAdmin: 0,
};

const CommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.countNotiAdmin = action.payload;
    },
  },
});

export const { setLoading, setNotificationCount } = CommonSlice.actions;

export default CommonSlice.reducer;
