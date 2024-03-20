import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    open: false,
  },
  reducers: {
    toggleSlider: (state) => {
      state.open = !state.open;
    },
  },
});

export default appSlice;
